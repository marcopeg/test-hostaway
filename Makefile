#
# Configuration & Defaults
#

endpoint?=http://localhost:8080
passwd?=hasura
project?=apps/bff
frontend?=apps/webapp
conn?=default
db=postgres
schema?=public
from?=default
steps?=1
name?=new-migration
q?=select now();


# Project Version
version?=1.0.0
help:
	@clear
	@echo ""
	@echo "---------------------"
	@echo "Hostaway United Inbox"
	@echo "Version: ${version}"
	@echo "---------------------"
	@echo ""
	@echo "Backend Commands:"
	@echo " 1) make start ................ Starts the services & initializes the project"
	@echo " 2) make down ................. Stops the services and cleans up the local state"
	@echo " 3) make logs ................. Connects to the docker compose logs"
	@echo "                                and initializes the project"
	@echo ""
	@echo "Frontend Commands:"
	@echo " 4) make react ................ Starts React dev server"
	@echo " 5) make react.reset .......... Reinstalls dependencies and runs it again"
	@echo ""
	@echo "State Management:               (depends on hasura-cli)"
	@echo " 6) make init ................. Applies the local state"
	@echo " 7) make clear ................ Removes all the application's state"
	@echo "    make meta ................. Applies Hasura metadata"
	@echo "    make meta.export .......... Exports metadata from Hasura"
	@echo "    make seed ................. Applies a seed file"
	@echo ""
	@echo "Migrations:                     (depends on hasura-cli)"
	@echo " 8) make migrate.status ........ Displays the current migration status"
	@echo "    make migrate ............... Applies the local state"
	@echo "    make migrate.clear ......... Reverts all migrations"
	@echo "    make migrate.up steps=1 .... Apply N migrations"
	@echo "    make migrate.down steps=1 .. Revert N migrations"
	@echo "    make migrate.redo .......... Redo the last migration"
	@echo ""
	@echo "    General Utilities"
	@echo "-----------------------------"
	@echo "00) make reset ................ Cleans & reboots the Project"
	@echo ""


# Whatever can be checked before starting the project
_check_boot:
	@if [ ! -f .env ]; then echo "\n\n====== WARNING ======\nLocal '.env' file not found;\nPlease create a '.env' file using the template from '.env.example'\n\n\n"; fi

# Waiting for services to come to life
_check_healthz:
	@until curl -s http://localhost:8080/healthz > /dev/null; do sleep 1; done


# Start all the services binding ports on your machine
# > http://localhost:3000 - Start working on your App
start: _check_boot
	@echo "Starting the Project on Docker..."
	@docker compose up -d
	@$(MAKE) -s -f Makefile _check_healthz

stop:
	@echo "Stopping the Project..."
	@docker compose down --remove-orphans

down:
	@echo "Destroying the Project..."
	@docker compose down -v --remove-orphans

# Applies any initial state to the project
# (migrations, configurations, ...)
# NOTE: this command is idempotent
_init:
	@$(MAKE) -s -f Makefile _migrate
	@$(MAKE) -s -f Makefile _meta
	@$(MAKE) -s -f Makefile _seed
	@docker compose $(DOCKER_COMPOSE_CHAIN) exec -T postgres psql -U postgres $(db) < $(project)/sql/$(conn)/default.sql
init:
	@clear
	@echo "\n# Initializing Hasura State from:\n> conn=$(conn) seed=$(from).sql\n"
	@$(MAKE) -s -f Makefile _init

# Removes all the application's state
# think twice before running this, but run this as often as possible
# 🔥 like every morning or in between branch switching 🔥
_clear:
	@$(MAKE) -s -f Makefile _meta.clear
	@$(MAKE) -s -f Makefile _migrate.clear
clear:
	@clear
	@echo "\n# Resetting App State from:\n> project=$(project); conn=$(conn) seed=$(from).sql\n"
	@$(MAKE) -s -f Makefile _clear

# Forces a rebuild of any artifact
build:
	@echo "Pulling Docker images..."
	@docker compose pull
	@echo "Building Docker images..."
	@docker compose build
rebuild:
	@echo "Pulling Docker images..."
	@docker compose pull
	@echo "Building Docker images..."
	@docker compose build --no-cache

logs:
	@docker compose logs -f
restart: stop start
reset: down rebuild boot
# Placeholder for additional boot logic
boot: start app
reboot: down boot





#
# Webapp Tasks
#

app: app.install app.start

app.install:
	@if [ ! -d ./$(frontend)/node_modules ]; then \
		echo "Installing node_modules..." ; \
		(cd $(frontend) && npm install) ; \
	fi ;

app.start:
	@echo "Starting the Frontend App on local NodeJS..." ;
	(cd $(frontend) && npm run dev) ;

test.api:
	@echo "Running Hasura API tests..."
	(cd $(frontend) && npm run test:api) ;

app.clean:
	@echo "Cleaning up frontend dependencies..."
	@rm -rf ./$(frontend)/package-lock.json
	@rm -rf ./$(frontend)/node_modules

app.reset: app.clean app








#
# Hasura Migrations Utilities
#

_migrate:
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn)
migrate:
	@clear
	@echo "\n# Running migrations from:\n> $(project)/migrations/$(conn)/*\n"
	@$(MAKE) -s -f Makefile _migrate

migrate.skip:
	@clear
	@echo "\n# Running migrations from:\n> $(project)/migrations/$(conn)/*\n"
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--skip-execution

_migrate.status:
	@hasura migrate status \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn)
migrate.status:
	@clear
	@echo "\n# Checking migrations status on:\n> project=$(project); conn=$(conn)"
	@$(MAKE) -s -f Makefile _migrate.status

_migrate.up:
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--up $(steps)
migrate.up:
	@clear
	@echo "\n# Migrate $(steps) UP from:\n> $(project)/migrations/$(conn)/*\n"
	@$(MAKE) -s -f Makefile _migrate.up

_migrate.down:
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--down $(steps)
migrate.down:
	@clear
	@echo "\n# Migrate $(steps) DOWN from:\n> $(project)/migrations/$(conn)/*\n"
	@$(MAKE) -s -f Makefile _migrate.down

_migrate.clear:
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--down all
migrate.clear:
	@clear
	@echo "\n# Destroy migrations on:\n> project=$(project); conn=$(conn)\n"
	@$(MAKE) -s -f Makefile _migrate.clear

migrate.delete:
	@clear
	@echo "\n# Destroy migrations on:\n> project=$(project); conn=$(conn)\n"
	@hasura migrate delete \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--all

migrate.clear.skip:
	@clear
	@echo "\n# Destroy migrations on:\n> project=$(project); conn=$(conn)\n"
	@hasura migrate apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--skip-execution \
		--down all

migrate.redo: 
	@clear
	@echo "\n# Replaying last $(steps) migrations on:\n> project=$(project); conn=$(conn)\n"
	@$(MAKE) -s -f Makefile _migrate.down
	@$(MAKE) -s -f Makefile _migrate.up

migrate.rebuild: 
	@clear
	@echo "\n# Rebuilding migrations on:\n> project=$(project); conn=$(conn)\n"
	@$(MAKE) -s -f Makefile _migrate.clear
	@$(MAKE) -s -f Makefile _migrate

migrate.create:
	@clear
	@echo "\n# Scaffolding a new migration on:\n> project=$(project); conn=$(conn); name=$(name)\n"
	@hasura migrate create \
		"$(name)" \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--up-sql "SELECT NOW();" \
		--down-sql "SELECT NOW();"
	@hasura migrate apply \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn)

_migrate.export:
	@hasura migrate create \
		"__full-export___" \
		--endpoint $(endpoint) \
  		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
  		--schema $(schema) \
  		--from-server \
		--down-sql "SELECT NOW();"
migrate.export:
	@clear
	@echo "\n# Dumping database to a migration:\n> project=$(project); conn=$(conn); schema=$(schema)\n"
	@$(MAKE) -s -f Makefile _migrate.export




#
# Hasura seeding utilities
# 2>&1 | sed 's/\x1b\[[0-9;]*m//g' > $(from).errors.txt

_seed:
	@hasura seed apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--file $(from).sql
seed:
	@clear
	@echo "\n# Seeding on:\n> project=$(project); conn=$(conn)\n"
	@$(MAKE) -s -f Makefile _seed

# Applies a seed script and dumps the output into a txt file
# stored beside the seed itself
seedbug:
	@hasura seed apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project) \
		--database-name $(conn) \
		--file $(from).sql \
		2>&1 | sed 's/\x1b\[[0-9;]*m//g' > $(project)/seeds/$(conn)/$(from).info.txt



#
# Hasura Metadata Utilities
#

_meta:
	@hasura metadata apply \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project)
meta:
	@clear
	@echo "\n# Apply Hasura Metadata on:\n> project=$(project)\n"
	@$(MAKE) -s -f Makefile _meta

_meta.export:
	@hasura metadata export \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project)
meta.export:
	@clear
	@echo "\n# Exporting Hasura metadata to:\n> project=$(project)\n"
	@$(MAKE) -s -f Makefile _meta.export

_meta.clear:
	@hasura metadata clear \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project)
meta.clear:
	@clear
	@echo "\n# Removing Hasura metadata to:\n> project=$(project)\n"
	@$(MAKE) -s -f Makefile _meta.clear

hasura.debug: 
	@clear
	@hasura metadata ic list \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project)

hasura.console:
	@clear
	@hasura console \
		--endpoint $(endpoint) \
		--admin-secret $(passwd) \
		--project $(project)









#
# Postgres Utilities
#

psql:
	@clear
	@echo "\n# Attaching SQL Client to:\n> db=$(db)\n"
	@docker compose $(DOCKER_COMPOSE_CHAIN) exec postgres psql -U postgres $(db)

query:
	@clear
	@echo "\n# Running a SQL script to DB \"$(db)\":\n>$(project)/sql/$(conn)/$(if $(filter-out new-migration,$(name)),$(name),$(from)).sql\n"
	@docker compose $(DOCKER_COMPOSE_CHAIN) exec -T postgres psql -U postgres $(db) < $(project)/sql/$(conn)/$(if $(filter-out new-migration,$(name)),$(name),$(from)).sql

dump.table:
	@docker compose $(DOCKER_COMPOSE_CHAIN) exec -T postgres pg_dump -U postgres -t $(schema).$(table) --data-only --inserts --no-owner --disable-triggers $(db) | grep -v -e "^SET " -e "^SELECT pg_catalog.set_config" -e "^RESET " -e "^ALTER " -e "^--" | awk '!NF{if (++n <= 1) print; next} {n=0; print}' > $(project)/seeds/$(conn)/$(schema).$(table).sql
	@echo "BEGIN;\nTRUNCATE TABLE $(schema).$(table) CASCADE;" | cat - $(project)/seeds/$(conn)/$(schema).$(table).sql > temp && mv temp $(project)/seeds/$(conn)/$(schema).$(table).sql	
	@echo "\nEND;" >> $(project)/seeds/$(conn)/$(schema).$(table).sql

# dump.content:
# 	@$(MAKE) dump.table schema=public table=xxx
# 	@$(MAKE) dump.table schema=public table=yyy

# seed.restore:
# 	@$(MAKE) seed from=public.xxx
# 	@$(MAKE) seed from=public.yyy
	





#
# Numeric API
#

00: reset
h: help
1: start
2: down
3: logs
4: app
5: app.reset
i: init
6: init
7: clear
8: migrate.status
