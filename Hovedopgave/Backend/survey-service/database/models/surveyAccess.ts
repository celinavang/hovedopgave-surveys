import { AllowNull, BelongsTo, Column, DataType, Table } from "sequelize-typescript";
import { AccessBase } from "./accessBase";
import Survey from "./survey";
import { SurveyRoles } from "../../generatedTypes";

@Table({
    freezeTableName: true,
    tableName: 'surveyAccess',
})
export class SurveyAccess extends AccessBase {
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        onDelete: 'CASCADE',
    })
    surveyId!: number;

    @AllowNull(false)
    @Column(DataType.ENUM({ values: ['CREATOR', 'EDITOR','REVIEWER', 'RESPONDER'] }))
    role!: SurveyRoles;

    @BelongsTo(() => Survey, 'surveyId')
    survey!: Survey;
}

export default SurveyAccess;