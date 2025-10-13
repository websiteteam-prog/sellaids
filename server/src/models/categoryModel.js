import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Category = sequelize.define(
    "Category",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Root category ke liye null
            references: {
                model: "categories",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false, // Admin ID
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "categories",
        timestamps: false,
    }
);

Category.hasMany(Category, { as: "subCategories", foreignKey: "parent_id" });
Category.belongsTo(Category, { as: "parentCategory", foreignKey: "parent_id" });