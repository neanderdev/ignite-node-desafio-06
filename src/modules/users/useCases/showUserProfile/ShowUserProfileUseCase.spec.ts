import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const createUser = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@test.com.br",
      password: "123456789",
    });

    const user = await showUserProfileUseCase.execute(createUser.id as string);

    expect(user).toHaveProperty("id");
  });

  it("should not be able show user profile with exists user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id_test");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
