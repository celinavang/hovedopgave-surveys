import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import SurveyInstance from "./surveyInstance";
import SurveyQuestion from "./surveyQuestion";
import SurveyQuestionOption from "./surveyQuestionOption";
import { on } from "events";

@Table({
    freezeTableName: true,
    tableName: 'surveyResponse',
})
class SurveyResponse extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => SurveyInstance)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        onDelete: 'CASCADE',
    })
    instanceId!: number;
    
    @ForeignKey(() => SurveyQuestion)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    questionId!: number;

    @ForeignKey(() => SurveyQuestionOption)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    optionId?: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    userInput?: string;

    @BelongsTo(() => SurveyInstance)
    surveyInstance!: SurveyInstance;
}

export default SurveyResponse;