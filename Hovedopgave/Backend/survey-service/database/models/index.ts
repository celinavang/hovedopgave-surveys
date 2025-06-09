import { Sequelize } from 'sequelize-typescript';
import process from 'process';
import { dbConfig } from '@kintella/shared';
import Survey from './survey';
import SurveyQuestion from './surveyQuestion';
import SurveyQuestionOption from './surveyQuestionOption';
import SurveySection from './surveySection';
import SurveyInstance from './surveyInstance';
import SurveyResponse from './SurveyResponse';
import SurveyAccess from './surveyAccess';
import SurveyResponseAccess from './surveyResponseAccess';

const configInstance = dbConfig({ process });

interface dbInstance {
    sequelize: Sequelize;
}

const sequelize = new Sequelize({
    database: configInstance.database || 'survey_service',
    dialect: configInstance.dialect || '',
    username: configInstance.username || '',
    password: configInstance.password || '',
    host: configInstance.host || '',
    logging: configInstance.logging || false,
    dialectOptions: configInstance.dialectOptions,
});

sequelize.addModels([
    Survey,
    SurveyQuestion,
    SurveyQuestionOption,
    SurveySection,
    SurveyInstance,
    SurveyResponse,
    SurveyAccess,
    SurveyResponseAccess
]);

const db: dbInstance = {
    sequelize,
};

export default db;
