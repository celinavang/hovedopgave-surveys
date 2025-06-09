import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Not, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import { SurveyInstanceStatusEnum } from "../../generatedTypes";
import SurveyAccess from "./surveyAccess";

@Table({
    freezeTableName: true,
    tableName: 'surveyInstance',
})
class SurveyInstance extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => SurveyAccess)
    @AllowNull(false)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    surveyAccessId!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    invitedById?: number;

    @AllowNull(true)
    @Column(DataType.DATE)
    deadline?: string;

    @AllowNull(false)
    @Column(DataType.ENUM({ values: ['AWAITING', 'COMPLETED'] }))
    status!: SurveyInstanceStatusEnum;

    @AllowNull(false)
    @Column(DataType.DATE)
    invitationDate!: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    responseDate?: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    invitationMessage?: string;

    @BelongsTo(() => SurveyAccess)
    surveyAccess!: SurveyAccess;
}

export default SurveyInstance;