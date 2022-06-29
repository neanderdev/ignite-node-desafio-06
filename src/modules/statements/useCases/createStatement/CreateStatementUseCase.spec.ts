import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create User", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@email.com.br",
      password: "123456789",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a withdraw statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@email.com",
      name: "user",
      password: "123",
    });

    await createStatementUseCase.execute({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await createStatementUseCase.execute({
      amount: 400,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a statement with exists user", () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Test",
        email: "test@email.com.br",
        password: "123456789",
      });

      await createStatementUseCase.execute({
        user_id: "uid",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw statement with insufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@email.com",
        name: "user",
        password: "123",
      });

      await createStatementUseCase.execute({
        amount: 500,
        description: "withdraw test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
