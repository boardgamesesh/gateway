all: test

define print
	@echo "\033[0;35m### $(1) ...\033[0m"
endef

test: ;$(call print,Running tests); \
	npm run test

local-deploy: ;$(call print,Deploying from local); \
	npx sst start --profile boarganise

.PHONY: seed test coverage start local-deploy local-seed