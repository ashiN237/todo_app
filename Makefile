.PHONY: start stop start-frontend

start:
	@echo "Starting backend..."
	@cd backend && docker-compose up -d --build
	@docker exec -d server /bin/sh -c "go run main.go"

	@$(MAKE) start-frontend

start-frontend:
	@echo "Starting frontend..."
	@cd frontend && npm start

stop:
	@echo "Stopping backend..."
	@cd backend && docker-compose down
