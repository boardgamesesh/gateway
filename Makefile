all: test

define print
	@echo "\033[0;35m### $(1) ...\033[0m"
endef

test: ;$(call print,Running tests); \
	npm run test

start: ;$(call print,Starting local dev environment); \
	npx sst start --profile boarganise --stage dev

deploy: ;$(call print,Starting local dev environment); \
	npx sst deploy --profile boarganise --stage prod

destroy: ;$(call print,Destroying nonlocal resources); \
	npx sst remove --profile boarganise --stage dev

.PHONY: test start deploy destroy