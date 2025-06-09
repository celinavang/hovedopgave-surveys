import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    NotNull,
    Default,
} from 'sequelize-typescript';
import { SurveyStatusEnum } from '../../generatedTypes';

@Table({
    freezeTableName: true,
    tableName: 'survey',
})
class Survey extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @NotNull
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    creatorId!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    title!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    description!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    timeEstimate?: string;

    @Default('DRAFT')
    @Column(DataType.ENUM({ values: ['DRAFT', 'PUBLISHED', 'TEMPLATE'] }))
    status!: SurveyStatusEnum;

    @Default(false)
    @Column(DataType.BOOLEAN)
    anonymous!: boolean;
    
}



export default Survey;
