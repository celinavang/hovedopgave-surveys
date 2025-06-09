import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { AccessBase } from "./accessBase";
import { SurveyRoles } from "../../generatedTypes";
import SurveyAccess from "./surveyAccess";

@Table({
    freezeTableName: true,
    tableName: 'surveyResponseAccess',
})
export class SurveyResponseAccess extends AccessBase {
  @ForeignKey(() => SurveyAccess)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    })
    accessId!: number;

    @AllowNull(false)
    @Column(DataType.ENUM({ values: ['CREATOR', 'REVIEWER', 'RESPONDER'] }))
    role!: SurveyRoles

    @BelongsTo(() => SurveyAccess, 'accessId')
    access!: SurveyAccess;
}

export default SurveyResponseAccess;