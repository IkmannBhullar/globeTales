import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { scrapbookSchema } from "@/lib/validation/scrapbook";

describe("validation schemas", () => {
  it("rejects weak registration passwords", () => {
    const result = registerSchema.safeParse({
      name: "Ava",
      email: "ava@example.com",
      password: "password"
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid login input", () => {
    const result = loginSchema.safeParse({
      email: "ava@example.com",
      password: "TravelMore123!"
    });

    expect(result.success).toBe(true);
  });

  it("requires at least one scrapbook entry", () => {
    const result = scrapbookSchema.safeParse({
      countryCode: "JPN",
      itineraryId: "",
      title: "Tokyo story",
      description: "",
      coverImage: "",
      startDate: "",
      endDate: "",
      layoutType: "GRID",
      rating: 5,
      favoriteMemory: "",
      entries: []
    });

    expect(result.success).toBe(false);
  });
});
