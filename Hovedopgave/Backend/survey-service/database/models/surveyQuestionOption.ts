import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import SurveyQuestion from "./surveyQuestion";

@Table({
    freezeTableName: true,
    tableName: 'surveyQuestionOption',
})
class SurveyQuestionOption extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => SurveyQuestion)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        onDelete: 'CASCADE'
    })
    questionId!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    text!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    position!: number;

    @BelongsTo(() => SurveyQuestion)
    question!: SurveyQuestion;

}

export default SurveyQuestionOption;