import { connectDB } from "../server";
import db from "../config/db";

jest.mock("../config/db");

describe("connect DB", () => {
  it("Should handle database conection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValue(new Error("Hubo un error al conectar con la BD"));
    const consoleSpy = jest.spyOn(console, "log");

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar con la BD")
    );
  });
});
