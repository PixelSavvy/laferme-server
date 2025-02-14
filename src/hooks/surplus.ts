import { Surplus } from "@/models/surplus";

Surplus.beforeCreate((surplus) => {
  const { expiresAt, createdAt } = surplus;

  if (!expiresAt) surplus.expiresAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 3);
});
