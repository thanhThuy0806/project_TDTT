import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/database.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ success: false, error: "Thiếu thông tin bắt buộc" });
    }

    const newFavorite = await db
      .inset(favoritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings })
      .returning();

    res.status(201).json({ success: true, data: newFavorite[0] });
  } catch (error) {
    console.log("Lỗi khi thêm vào yêu thích: ", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ" });
  }
});

app.delete("/apoi/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );
    res.status(200).json({ success: true, message: "Đã xóa khỏi yêu thích" });
  } catch (error) {
    console.log("Lỗi khi xóa khỏi yêu thích: ", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json({ success: true, data: userFavorites });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách yêu thích: ", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ" });
  }
});

app.listen(PORT, () => {
  console.log("Server đang chạy tại PORT: ", PORT);
});
