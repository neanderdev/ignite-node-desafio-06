import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@test.com.br",
      password: "123456789",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with exists email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com.br",
        password: "123456789",
      });

      await createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com.br",
        password: "123456789",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
