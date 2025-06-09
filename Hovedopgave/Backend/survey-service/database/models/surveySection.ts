import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import Survey from "./survey";
import { on } from "events";

@Table({
    freezeTableName: true,
    tableName: 'surveySection',
})
class SurveySection extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Survey)
    @AllowNull(false)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    surveyId!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    title!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    description!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    position!: number;

    @BelongsTo(() => Survey)
    survey!: Survey;

}

export default SurveySection;