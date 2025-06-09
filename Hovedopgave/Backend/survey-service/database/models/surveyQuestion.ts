import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import SurveySection from "./surveySection";
import { Col } from "sequelize/types/utils";
import { QuestionTypeEnum } from "../../generatedTypes";

@Table({
    freezeTableName: true,
    tableName: 'surveyQuestion',
})
class SurveyQuestion extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => SurveySection)
    @AllowNull(false)
    @Column({
            type: DataType.INTEGER,
            onDelete: 'CASCADE',
        })
    sectionId!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    question!: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    description?: string;

    @AllowNull(true)
    @Column(DataType.ENUM({ values: ['SINGLE', 'TEXTSECTION', 'RATING', 'TEXTINPUT', 'LIKERT'] }))
    type?: QuestionTypeEnum;

    @Column(DataType.BOOLEAN)
    required!: boolean;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    position!: number;

    @BelongsTo(() => SurveySection)
    section!: SurveySection;

}

export default SurveyQuestion;