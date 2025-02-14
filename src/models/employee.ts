import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

import { sequelize } from "@/lib";

type EmployeeType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fullName?: string;
};

interface EmployeeInstance
  extends EmployeeType,
    Model<InferAttributes<EmployeeInstance>, InferCreationAttributes<EmployeeInstance, { omit: "id" }>> {}

const Employee = sequelize.define<EmployeeInstance>(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get() {
        const firstName = this.getDataValue("firstName");
        const lastName = this.getDataValue("lastName");
        return `${firstName} ${lastName}`;
      },
    },
  },
  {
    timestamps: false,
    indexes: [],
  }
);

export { Employee, type EmployeeInstance };
