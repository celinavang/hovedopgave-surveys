import { AllowNull, AutoIncrement, Column, DataType, Model, NotNull, PrimaryKey } from "sequelize-typescript";
import { EntityType } from "../../generatedTypes";

export class AccessBase extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    entityId!: number;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    entityType!: EntityType;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    accessGrantorId!: number; 
}