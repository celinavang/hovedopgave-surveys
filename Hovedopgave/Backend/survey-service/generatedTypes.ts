import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: any; output: any; }
};

export type AccessBase = {
  accessGrantor: Scalars['Int']['output'];
  accessId: Scalars['Int']['output'];
  entityId: Scalars['Int']['output'];
  entityType: EntityType;
  recieverType: Array<RecieverType>;
};

export enum AccessRoleEnum {
  All = 'ALL',
  Employee = 'EMPLOYEE',
  Relative = 'RELATIVE',
  Resident = 'RESIDENT'
}

export type CacheEntityAccess = {
  __typename?: 'CacheEntityAccess';
  entityId: Scalars['Int']['output'];
  entityType: EntityType;
  role: KintellaRoleEnum;
  userId?: Maybe<Scalars['Int']['output']>;
};

export enum CompanyUserType {
  Employee = 'EMPLOYEE',
  Resident = 'RESIDENT'
}

export type EntityAccessInput = {
  entityId: Scalars['Int']['input'];
  entityType: EntityType;
};

export enum EntityType {
  Company = 'COMPANY',
  Division = 'DIVISION',
  Group = 'GROUP',
  Organization = 'ORGANIZATION',
  User = 'USER'
}

export enum ErrorEnum {
  AlreadyExistsError = 'AlreadyExistsError',
  EmailExistsError = 'EmailExistsError',
  Fa2ValidationError = 'FA2ValidationError',
  InvalidCredentialsError = 'InvalidCredentialsError',
  NotFoundError = 'NotFoundError'
}

export type FileCreateInput = {
  base64: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export enum KintellaRoleEnum {
  Admin = 'ADMIN',
  CompanyAdmin = 'COMPANY_ADMIN',
  CompanyOwner = 'COMPANY_OWNER',
  Employee = 'EMPLOYEE',
  EmployeeToUser = 'EMPLOYEE_TO_USER',
  External = 'EXTERNAL',
  Owner = 'OWNER',
  PrimaryRelative = 'PRIMARY_RELATIVE',
  Relative = 'RELATIVE',
  Resident = 'RESIDENT',
  User = 'USER',
  UserToEmployee = 'USER_TO_EMPLOYEE'
}

export type MessageResponse = {
  __typename?: 'MessageResponse';
  ids?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export enum MessageResponseEnum {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Failed = 'FAILED',
  Send = 'SEND',
  Success = 'SUCCESS',
  Updated = 'UPDATED',
  Validated = 'VALIDATED'
}

export type MultipleDeleteResponse = {
  __typename?: 'MultipleDeleteResponse';
  deleted?: Maybe<Scalars['Int']['output']>;
  failed?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bulkCreateSurveyResponse?: Maybe<MessageResponse>;
  createSurvey?: Maybe<MessageResponse>;
  createSurveyAccess?: Maybe<MessageResponse>;
  createSurveyAccessWithSurveyInstance?: Maybe<MessageResponse>;
  createSurveyInstance?: Maybe<MessageResponse>;
  createSurveyResponse?: Maybe<MessageResponse>;
  createSurveyUser?: Maybe<MessageResponse>;
  deleteSurveyAccessById?: Maybe<MessageResponse>;
  deleteSurveyById?: Maybe<MessageResponse>;
  deleteSurveyInstanceById?: Maybe<MessageResponse>;
  deleteSurveyResponseById?: Maybe<MessageResponse>;
  deleteSurveyUserById?: Maybe<MessageResponse>;
  root?: Maybe<Scalars['String']['output']>;
  updateSurveyAccessById?: Maybe<MessageResponse>;
  updateSurveyAccessRoleById?: Maybe<MessageResponse>;
  updateSurveyById?: Maybe<MessageResponse>;
  updateSurveyInstanceById?: Maybe<MessageResponse>;
  updateSurveyInstanceStatusById?: Maybe<MessageResponse>;
  updateSurveyUserById?: Maybe<MessageResponse>;
  updateSurveyUserRoleById?: Maybe<MessageResponse>;
};


export type MutationBulkCreateSurveyResponseArgs = {
  input: Array<SurveyResponseCreateInput>;
};


export type MutationCreateSurveyArgs = {
  input: SurveyInput;
};


export type MutationCreateSurveyAccessArgs = {
  input: SurveyAccessInput;
};


export type MutationCreateSurveyAccessWithSurveyInstanceArgs = {
  input: SurveyAccessInputWithSurveyInstance;
};


export type MutationCreateSurveyInstanceArgs = {
  input: SurveyInstanceCreateInput;
};


export type MutationCreateSurveyResponseArgs = {
  input: SurveyResponseCreateInput;
};


export type MutationCreateSurveyUserArgs = {
  input: SurveyUserCreateInput;
};


export type MutationDeleteSurveyAccessByIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSurveyByIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSurveyInstanceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSurveyResponseByIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSurveyUserByIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateSurveyAccessByIdArgs = {
  input: SurveyAccessInput;
};


export type MutationUpdateSurveyAccessRoleByIdArgs = {
  id: Scalars['Int']['input'];
  role: SurveyRoles;
};


export type MutationUpdateSurveyByIdArgs = {
  id: Scalars['Int']['input'];
  input: SurveyInput;
};


export type MutationUpdateSurveyInstanceByIdArgs = {
  id: Scalars['Int']['input'];
  input: SurveyInstanceUpdateInput;
};


export type MutationUpdateSurveyInstanceStatusByIdArgs = {
  id: Scalars['Int']['input'];
  status: SurveyInstanceStatusEnum;
};


export type MutationUpdateSurveyUserByIdArgs = {
  input: SurveyUserUpdateInput;
};


export type MutationUpdateSurveyUserRoleByIdArgs = {
  id: Scalars['Int']['input'];
  role: SurveyRoles;
};

export enum NotificationTypeEnum {
  Calendar = 'CALENDAR',
  DocumentShare = 'DOCUMENT_SHARE',
  Invite = 'INVITE',
  Item = 'ITEM',
  Lifestory = 'LIFESTORY',
  News = 'NEWS',
  Other = 'OTHER',
  Ticket = 'TICKET'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage?: Maybe<Scalars['Int']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PageInput = {
  pagination: PaginationInput;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PaginationInput = {
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllSurveyAccess?: Maybe<Array<Maybe<SurveyAccess>>>;
  getAllSurveyInstances?: Maybe<Array<SurveyInstance>>;
  getAllSurveyResponses?: Maybe<Array<SurveyResponse>>;
  getAllSurveyUsers?: Maybe<Array<Maybe<SurveyAccess>>>;
  getAllSurveyUsersByUserId?: Maybe<Array<Maybe<SurveyAccess>>>;
  getAllSurveys?: Maybe<Array<Maybe<Survey>>>;
  getSurveyAccessById?: Maybe<SurveyAccess>;
  getSurveyById?: Maybe<Survey>;
  getSurveyInstanceById?: Maybe<SurveyInstance>;
  getSurveyInstancesBySurveyAccessId?: Maybe<Array<SurveyInstance>>;
  getSurveyResponseById?: Maybe<SurveyResponse>;
  getSurveyResponseByInstanceId?: Maybe<Array<SurveyResponse>>;
  getSurveyUserBySurveyId?: Maybe<Array<Maybe<SurveyAccess>>>;
  root?: Maybe<Scalars['String']['output']>;
};


export type QueryGetAllSurveyAccessArgs = {
  input?: InputMaybe<SurveyAccessFilterOptions>;
};


export type QueryGetAllSurveyInstancesArgs = {
  input?: InputMaybe<SurveyInstanceFilterOptions>;
};


export type QueryGetAllSurveyResponsesArgs = {
  input?: InputMaybe<SurveyResponseFilterOptions>;
};


export type QueryGetAllSurveyUsersArgs = {
  input?: InputMaybe<SurveyUserFilterOptions>;
};


export type QueryGetAllSurveyUsersByUserIdArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryGetAllSurveysArgs = {
  input?: InputMaybe<SurveyFilterOptions>;
};


export type QueryGetSurveyAccessByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSurveyByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSurveyInstanceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSurveyInstancesBySurveyAccessIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSurveyResponseByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSurveyResponseByInstanceIdArgs = {
  instanceId: Scalars['Int']['input'];
};


export type QueryGetSurveyUserBySurveyIdArgs = {
  surveyId: Scalars['Int']['input'];
};

export enum QuestionTypeEnum {
  Likert = 'LIKERT',
  Rating = 'RATING',
  Single = 'SINGLE',
  Textinput = 'TEXTINPUT',
  Textsection = 'TEXTSECTION'
}

export enum RecieverType {
  All = 'ALL',
  Employee = 'EMPLOYEE',
  Relative = 'RELATIVE',
  Resident = 'RESIDENT'
}

export type Survey = {
  __typename?: 'Survey';
  accessActions?: Maybe<Array<Maybe<SurveyActions>>>;
  accessType?: Maybe<SurveyRoles>;
  anonymous?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  creatorId: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  sections?: Maybe<Array<Maybe<SurveySection>>>;
  status: SurveyStatusEnum;
  surveyAccess?: Maybe<Array<Maybe<SurveyAccess>>>;
  surveyInstances?: Maybe<Array<Maybe<SurveyInstance>>>;
  timeEstimate?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type SurveyAccess = {
  __typename?: 'SurveyAccess';
  accessGrantorId: Scalars['Int']['output'];
  entityId: Scalars['Int']['output'];
  entityType: EntityType;
  id: Scalars['Int']['output'];
  role: SurveyRoles;
  survey?: Maybe<Survey>;
  surveyId: Scalars['Int']['output'];
  surveyInstances?: Maybe<Array<Maybe<SurveyInstance>>>;
};

export type SurveyAccessFilterOptions = {
  entityId?: InputMaybe<Scalars['Int']['input']>;
  entityType?: InputMaybe<EntityType>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<SurveyRoles>;
  surveyId?: InputMaybe<Scalars['Int']['input']>;
};

export type SurveyAccessInput = {
  accessGrantorId: Scalars['Int']['input'];
  entityId: Scalars['Int']['input'];
  entityType: EntityType;
  id?: InputMaybe<Scalars['Int']['input']>;
  role: SurveyRoles;
  surveyId?: InputMaybe<Scalars['Int']['input']>;
};

export type SurveyAccessInputWithSurveyInstance = {
  deadline?: InputMaybe<Scalars['String']['input']>;
  invitationDate?: InputMaybe<Scalars['String']['input']>;
  invitationMessage?: InputMaybe<Scalars['String']['input']>;
  surveyAccess: SurveyAccessInput;
};

export enum SurveyActions {
  Create = 'CREATE',
  Delete = 'DELETE',
  Edit = 'EDIT',
  Invite = 'INVITE',
  Read = 'READ',
  Share = 'SHARE'
}

export type SurveyFilterOptions = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<SurveyStatusEnum>;
};

export type SurveyInput = {
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  creatorId: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  sections?: InputMaybe<Array<InputMaybe<SurveySectionInput>>>;
  status: SurveyStatusEnum;
  surveyAccess?: InputMaybe<Array<InputMaybe<SurveyAccessInput>>>;
  timeEstimate?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SurveyInstance = {
  __typename?: 'SurveyInstance';
  deadline?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  invitationDate: Scalars['String']['output'];
  invitationMessage?: Maybe<Scalars['String']['output']>;
  invitedById?: Maybe<Scalars['Int']['output']>;
  responseDate?: Maybe<Scalars['String']['output']>;
  status: SurveyInstanceStatusEnum;
  surveyAccess: SurveyAccess;
  surveyAccessId: Scalars['Int']['output'];
};

export type SurveyInstanceCreateInput = {
  deadline?: InputMaybe<Scalars['String']['input']>;
  invitationDate?: InputMaybe<Scalars['String']['input']>;
  invitationMessage?: InputMaybe<Scalars['String']['input']>;
  invitedById?: InputMaybe<Scalars['Int']['input']>;
  responseDate?: InputMaybe<Scalars['String']['input']>;
  surveyAccessId: Scalars['Int']['input'];
};

export type SurveyInstanceFilterOptions = {
  invitationDate?: InputMaybe<Scalars['String']['input']>;
  responseDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SurveyInstanceStatusEnum>;
  surveyAccessId?: InputMaybe<Scalars['Int']['input']>;
};

export enum SurveyInstanceStatusEnum {
  Awaiting = 'AWAITING',
  Completed = 'COMPLETED'
}

export type SurveyInstanceUpdateInput = {
  deadline?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  invitationMessage?: InputMaybe<Scalars['String']['input']>;
  responseDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SurveyInstanceStatusEnum>;
};

export type SurveyQuestion = {
  __typename?: 'SurveyQuestion';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  question: Scalars['String']['output'];
  questionOptions?: Maybe<Array<Maybe<SurveyQuestionOption>>>;
  required?: Maybe<Scalars['Boolean']['output']>;
  section?: Maybe<SurveySection>;
  sectionId: Scalars['Int']['output'];
  type?: Maybe<QuestionTypeEnum>;
};

export type SurveyQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  question: Scalars['String']['input'];
  questionOptions?: InputMaybe<Array<InputMaybe<SurveyQuestionOptionInput>>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type: QuestionTypeEnum;
};

export type SurveyQuestionOption = {
  __typename?: 'SurveyQuestionOption';
  id: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  questionId: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type SurveyQuestionOptionInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  questionId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type SurveyResponse = {
  __typename?: 'SurveyResponse';
  id: Scalars['Int']['output'];
  instance: SurveyInstance;
  instanceId: Scalars['Int']['output'];
  option?: Maybe<SurveyQuestionOption>;
  optionId?: Maybe<Scalars['Int']['output']>;
  question: SurveyQuestion;
  questionId: Scalars['Int']['output'];
  userInput?: Maybe<Scalars['String']['output']>;
};

export type SurveyResponseAccess = {
  __typename?: 'SurveyResponseAccess';
  accessGrantorId: Scalars['Int']['output'];
  accessId: Scalars['Int']['output'];
  entityId: Scalars['Int']['output'];
  entityType: EntityType;
  id: Scalars['Int']['output'];
  surveyAccess?: Maybe<SurveyAccess>;
  surveyInstances?: Maybe<Array<Maybe<SurveyInstance>>>;
};

export type SurveyResponseCreateInput = {
  instanceId: Scalars['Int']['input'];
  optionId?: InputMaybe<Scalars['Int']['input']>;
  questionId: Scalars['Int']['input'];
  userInput?: InputMaybe<Scalars['String']['input']>;
};

export type SurveyResponseFilterOptions = {
  instanceId?: InputMaybe<Scalars['Int']['input']>;
  optionId?: InputMaybe<Scalars['Int']['input']>;
  questionId?: InputMaybe<Scalars['Int']['input']>;
};

export enum SurveyRoles {
  Creator = 'CREATOR',
  Editor = 'EDITOR',
  Responder = 'RESPONDER',
  Reviewer = 'REVIEWER'
}

export type SurveySection = {
  __typename?: 'SurveySection';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  questions?: Maybe<Array<Maybe<SurveyQuestion>>>;
  survey?: Maybe<Survey>;
  surveyId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type SurveySectionInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  questions?: InputMaybe<Array<InputMaybe<SurveyQuestionInput>>>;
  title: Scalars['String']['input'];
};

export enum SurveyStatusEnum {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Template = 'TEMPLATE'
}

export type SurveyUser = {
  __typename?: 'SurveyUser';
  id: Scalars['Int']['output'];
  instances?: Maybe<Array<SurveyInstance>>;
  role: SurveyRoles;
  survey: Survey;
  surveyId: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type SurveyUserCreateInput = {
  role: SurveyRoles;
  surveyId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type SurveyUserFilterOptions = {
  role?: InputMaybe<SurveyRoles>;
  surveyId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type SurveyUserUpdateInput = {
  id: Scalars['Int']['input'];
  role?: InputMaybe<SurveyRoles>;
};

export enum SystemIntegrationEnum {
  Cura = 'CURA'
}

export enum SystemUserRole {
  Admin = 'ADMIN',
  Passive = 'PASSIVE',
  User = 'USER'
}

export enum TicketActionEnum {
  Active = 'active',
  Closed = 'closed',
  Invited = 'invited',
  Left = 'left',
  Opened = 'opened',
  Removed = 'removed'
}

export enum TicketStatusEnum {
  Active = 'active',
  Closed = 'closed',
  Open = 'open'
}

export enum TicketUserRoleEnum {
  Assignee = 'assignee',
  Company = 'company',
  Creator = 'creator',
  Leader = 'leader',
  Participant = 'participant',
  Resident = 'resident'
}

export enum UserGroupTypeEnum {
  CompanyGroup = 'COMPANY_GROUP',
  CompanyResidentsGroup = 'COMPANY_RESIDENTS_GROUP',
  Default = 'DEFAULT',
  EmployeeGroup = 'EMPLOYEE_GROUP',
  InterestGroup = 'INTEREST_GROUP',
  RelativeGroup = 'RELATIVE_GROUP'
}

export enum UserType {
  Company = 'COMPANY',
  Private = 'PRIVATE'
}

export enum UserTypeEnum {
  Employee = 'EMPLOYEE',
  Resident = 'RESIDENT',
  User = 'USER'
}

export type ValidateEntityAccessInput = {
  entities: Array<EntityAccessInput>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  AccessBase: never;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccessBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AccessBase']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AccessRoleEnum: AccessRoleEnum;
  CacheEntityAccess: ResolverTypeWrapper<CacheEntityAccess>;
  CompanyUserType: CompanyUserType;
  EntityAccessInput: EntityAccessInput;
  EntityType: EntityType;
  ErrorEnum: ErrorEnum;
  FileCreateInput: FileCreateInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  KintellaRoleEnum: KintellaRoleEnum;
  MessageResponse: ResolverTypeWrapper<MessageResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  MessageResponseEnum: MessageResponseEnum;
  MultipleDeleteResponse: ResolverTypeWrapper<MultipleDeleteResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationTypeEnum: NotificationTypeEnum;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageInput: PageInput;
  PaginationInput: PaginationInput;
  Query: ResolverTypeWrapper<{}>;
  QuestionTypeEnum: QuestionTypeEnum;
  RecieverType: RecieverType;
  Survey: ResolverTypeWrapper<Survey>;
  SurveyAccess: ResolverTypeWrapper<SurveyAccess>;
  SurveyAccessFilterOptions: SurveyAccessFilterOptions;
  SurveyAccessInput: SurveyAccessInput;
  SurveyAccessInputWithSurveyInstance: SurveyAccessInputWithSurveyInstance;
  SurveyActions: SurveyActions;
  SurveyFilterOptions: SurveyFilterOptions;
  SurveyInput: SurveyInput;
  SurveyInstance: ResolverTypeWrapper<SurveyInstance>;
  SurveyInstanceCreateInput: SurveyInstanceCreateInput;
  SurveyInstanceFilterOptions: SurveyInstanceFilterOptions;
  SurveyInstanceStatusEnum: SurveyInstanceStatusEnum;
  SurveyInstanceUpdateInput: SurveyInstanceUpdateInput;
  SurveyQuestion: ResolverTypeWrapper<SurveyQuestion>;
  SurveyQuestionInput: SurveyQuestionInput;
  SurveyQuestionOption: ResolverTypeWrapper<SurveyQuestionOption>;
  SurveyQuestionOptionInput: SurveyQuestionOptionInput;
  SurveyResponse: ResolverTypeWrapper<SurveyResponse>;
  SurveyResponseAccess: ResolverTypeWrapper<SurveyResponseAccess>;
  SurveyResponseCreateInput: SurveyResponseCreateInput;
  SurveyResponseFilterOptions: SurveyResponseFilterOptions;
  SurveyRoles: SurveyRoles;
  SurveySection: ResolverTypeWrapper<SurveySection>;
  SurveySectionInput: SurveySectionInput;
  SurveyStatusEnum: SurveyStatusEnum;
  SurveyUser: ResolverTypeWrapper<SurveyUser>;
  SurveyUserCreateInput: SurveyUserCreateInput;
  SurveyUserFilterOptions: SurveyUserFilterOptions;
  SurveyUserUpdateInput: SurveyUserUpdateInput;
  SystemIntegrationEnum: SystemIntegrationEnum;
  SystemUserRole: SystemUserRole;
  TicketActionEnum: TicketActionEnum;
  TicketStatusEnum: TicketStatusEnum;
  TicketUserRoleEnum: TicketUserRoleEnum;
  UserGroupTypeEnum: UserGroupTypeEnum;
  UserType: UserType;
  UserTypeEnum: UserTypeEnum;
  ValidateEntityAccessInput: ValidateEntityAccessInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessBase: ResolversInterfaceTypes<ResolversParentTypes>['AccessBase'];
  Int: Scalars['Int']['output'];
  CacheEntityAccess: CacheEntityAccess;
  EntityAccessInput: EntityAccessInput;
  FileCreateInput: FileCreateInput;
  String: Scalars['String']['output'];
  MessageResponse: MessageResponse;
  Boolean: Scalars['Boolean']['output'];
  MultipleDeleteResponse: MultipleDeleteResponse;
  Mutation: {};
  PageInfo: PageInfo;
  PageInput: PageInput;
  PaginationInput: PaginationInput;
  Query: {};
  Survey: Survey;
  SurveyAccess: SurveyAccess;
  SurveyAccessFilterOptions: SurveyAccessFilterOptions;
  SurveyAccessInput: SurveyAccessInput;
  SurveyAccessInputWithSurveyInstance: SurveyAccessInputWithSurveyInstance;
  SurveyFilterOptions: SurveyFilterOptions;
  SurveyInput: SurveyInput;
  SurveyInstance: SurveyInstance;
  SurveyInstanceCreateInput: SurveyInstanceCreateInput;
  SurveyInstanceFilterOptions: SurveyInstanceFilterOptions;
  SurveyInstanceUpdateInput: SurveyInstanceUpdateInput;
  SurveyQuestion: SurveyQuestion;
  SurveyQuestionInput: SurveyQuestionInput;
  SurveyQuestionOption: SurveyQuestionOption;
  SurveyQuestionOptionInput: SurveyQuestionOptionInput;
  SurveyResponse: SurveyResponse;
  SurveyResponseAccess: SurveyResponseAccess;
  SurveyResponseCreateInput: SurveyResponseCreateInput;
  SurveyResponseFilterOptions: SurveyResponseFilterOptions;
  SurveySection: SurveySection;
  SurveySectionInput: SurveySectionInput;
  SurveyUser: SurveyUser;
  SurveyUserCreateInput: SurveyUserCreateInput;
  SurveyUserFilterOptions: SurveyUserFilterOptions;
  SurveyUserUpdateInput: SurveyUserUpdateInput;
  ValidateEntityAccessInput: ValidateEntityAccessInput;
};

export type AccessBaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessBase'] = ResolversParentTypes['AccessBase']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  accessGrantor?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  accessId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  recieverType?: Resolver<Array<ResolversTypes['RecieverType']>, ParentType, ContextType>;
};

export type CacheEntityAccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CacheEntityAccess'] = ResolversParentTypes['CacheEntityAccess']> = {
  entityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['KintellaRoleEnum'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse']> = {
  ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MultipleDeleteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MultipleDeleteResponse'] = ResolversParentTypes['MultipleDeleteResponse']> = {
  deleted?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  failed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  bulkCreateSurveyResponse?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationBulkCreateSurveyResponseArgs, 'input'>>;
  createSurvey?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyArgs, 'input'>>;
  createSurveyAccess?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyAccessArgs, 'input'>>;
  createSurveyAccessWithSurveyInstance?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyAccessWithSurveyInstanceArgs, 'input'>>;
  createSurveyInstance?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyInstanceArgs, 'input'>>;
  createSurveyResponse?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyResponseArgs, 'input'>>;
  createSurveyUser?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationCreateSurveyUserArgs, 'input'>>;
  deleteSurveyAccessById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSurveyAccessByIdArgs, 'id'>>;
  deleteSurveyById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSurveyByIdArgs, 'id'>>;
  deleteSurveyInstanceById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSurveyInstanceByIdArgs, 'id'>>;
  deleteSurveyResponseById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSurveyResponseByIdArgs, 'id'>>;
  deleteSurveyUserById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSurveyUserByIdArgs, 'id'>>;
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updateSurveyAccessById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyAccessByIdArgs, 'input'>>;
  updateSurveyAccessRoleById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyAccessRoleByIdArgs, 'id' | 'role'>>;
  updateSurveyById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyByIdArgs, 'id' | 'input'>>;
  updateSurveyInstanceById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyInstanceByIdArgs, 'id' | 'input'>>;
  updateSurveyInstanceStatusById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyInstanceStatusByIdArgs, 'id' | 'status'>>;
  updateSurveyUserById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyUserByIdArgs, 'input'>>;
  updateSurveyUserRoleById?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationUpdateSurveyUserRoleByIdArgs, 'id' | 'role'>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  currentPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  totalItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalPages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllSurveyAccess?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyAccess']>>>, ParentType, ContextType, Partial<QueryGetAllSurveyAccessArgs>>;
  getAllSurveyInstances?: Resolver<Maybe<Array<ResolversTypes['SurveyInstance']>>, ParentType, ContextType, Partial<QueryGetAllSurveyInstancesArgs>>;
  getAllSurveyResponses?: Resolver<Maybe<Array<ResolversTypes['SurveyResponse']>>, ParentType, ContextType, Partial<QueryGetAllSurveyResponsesArgs>>;
  getAllSurveyUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyAccess']>>>, ParentType, ContextType, Partial<QueryGetAllSurveyUsersArgs>>;
  getAllSurveyUsersByUserId?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyAccess']>>>, ParentType, ContextType, RequireFields<QueryGetAllSurveyUsersByUserIdArgs, 'userId'>>;
  getAllSurveys?: Resolver<Maybe<Array<Maybe<ResolversTypes['Survey']>>>, ParentType, ContextType, Partial<QueryGetAllSurveysArgs>>;
  getSurveyAccessById?: Resolver<Maybe<ResolversTypes['SurveyAccess']>, ParentType, ContextType, RequireFields<QueryGetSurveyAccessByIdArgs, 'id'>>;
  getSurveyById?: Resolver<Maybe<ResolversTypes['Survey']>, ParentType, ContextType, RequireFields<QueryGetSurveyByIdArgs, 'id'>>;
  getSurveyInstanceById?: Resolver<Maybe<ResolversTypes['SurveyInstance']>, ParentType, ContextType, RequireFields<QueryGetSurveyInstanceByIdArgs, 'id'>>;
  getSurveyInstancesBySurveyAccessId?: Resolver<Maybe<Array<ResolversTypes['SurveyInstance']>>, ParentType, ContextType, RequireFields<QueryGetSurveyInstancesBySurveyAccessIdArgs, 'id'>>;
  getSurveyResponseById?: Resolver<Maybe<ResolversTypes['SurveyResponse']>, ParentType, ContextType, RequireFields<QueryGetSurveyResponseByIdArgs, 'id'>>;
  getSurveyResponseByInstanceId?: Resolver<Maybe<Array<ResolversTypes['SurveyResponse']>>, ParentType, ContextType, RequireFields<QueryGetSurveyResponseByInstanceIdArgs, 'instanceId'>>;
  getSurveyUserBySurveyId?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyAccess']>>>, ParentType, ContextType, RequireFields<QueryGetSurveyUserBySurveyIdArgs, 'surveyId'>>;
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type SurveyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Survey'] = ResolversParentTypes['Survey']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Survey']>, { __typename: 'Survey' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"creatorId":true}>), ContextType>;
  accessActions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyActions']>>>, ParentType, ContextType>;
  accessType?: Resolver<Maybe<ResolversTypes['SurveyRoles']>, ParentType, ContextType>;
  anonymous?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sections?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveySection']>>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SurveyStatusEnum'], ParentType, ContextType>;
  surveyAccess?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyAccess']>>>, ParentType, ContextType>;
  surveyInstances?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyInstance']>>>, ParentType, ContextType>;
  timeEstimate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyAccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyAccess'] = ResolversParentTypes['SurveyAccess']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveyAccess']>, { __typename: 'SurveyAccess' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"entityId":true}> | GraphQLRecursivePick<ParentType, {"accessGrantorId":true}> | GraphQLRecursivePick<ParentType, {"surveyId":true}>), ContextType>;
  accessGrantorId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['SurveyRoles'], ParentType, ContextType>;
  survey?: Resolver<Maybe<ResolversTypes['Survey']>, ParentType, ContextType>;
  surveyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  surveyInstances?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyInstance']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyInstance'] = ResolversParentTypes['SurveyInstance']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveyInstance']>, { __typename: 'SurveyInstance' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"surveyAccessId":true}> | GraphQLRecursivePick<ParentType, {"invitedById":true}>), ContextType>;
  deadline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  invitationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  invitationMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invitedById?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  responseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SurveyInstanceStatusEnum'], ParentType, ContextType>;
  surveyAccess?: Resolver<ResolversTypes['SurveyAccess'], ParentType, ContextType>;
  surveyAccessId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyQuestion'] = ResolversParentTypes['SurveyQuestion']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveyQuestion']>, { __typename: 'SurveyQuestion' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"sectionId":true}>), ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyQuestionOption']>>>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['SurveySection']>, ParentType, ContextType>;
  sectionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['QuestionTypeEnum']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyQuestionOption'] = ResolversParentTypes['SurveyQuestionOption']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyResponse'] = ResolversParentTypes['SurveyResponse']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['SurveyInstance'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes['SurveyQuestionOption']>, ParentType, ContextType>;
  optionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['SurveyQuestion'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userInput?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyResponseAccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyResponseAccess'] = ResolversParentTypes['SurveyResponseAccess']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveyResponseAccess']>, { __typename: 'SurveyResponseAccess' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"entityId":true}> | GraphQLRecursivePick<ParentType, {"accessGrantorId":true}> | GraphQLRecursivePick<ParentType, {"accessId":true}>), ContextType>;
  accessGrantorId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  accessId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  surveyAccess?: Resolver<Maybe<ResolversTypes['SurveyAccess']>, ParentType, ContextType>;
  surveyInstances?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyInstance']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveySectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveySection'] = ResolversParentTypes['SurveySection']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveySection']>, { __typename: 'SurveySection' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"surveyId":true}>), ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SurveyQuestion']>>>, ParentType, ContextType>;
  survey?: Resolver<Maybe<ResolversTypes['Survey']>, ParentType, ContextType>;
  surveyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurveyUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyUser'] = ResolversParentTypes['SurveyUser']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['SurveyUser']>, { __typename: 'SurveyUser' } & (GraphQLRecursivePick<ParentType, {"id":true}> | GraphQLRecursivePick<ParentType, {"userId":true}>), ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instances?: Resolver<Maybe<Array<ResolversTypes['SurveyInstance']>>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['SurveyRoles'], ParentType, ContextType>;
  survey?: Resolver<ResolversTypes['Survey'], ParentType, ContextType>;
  surveyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccessBase?: AccessBaseResolvers<ContextType>;
  CacheEntityAccess?: CacheEntityAccessResolvers<ContextType>;
  MessageResponse?: MessageResponseResolvers<ContextType>;
  MultipleDeleteResponse?: MultipleDeleteResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Survey?: SurveyResolvers<ContextType>;
  SurveyAccess?: SurveyAccessResolvers<ContextType>;
  SurveyInstance?: SurveyInstanceResolvers<ContextType>;
  SurveyQuestion?: SurveyQuestionResolvers<ContextType>;
  SurveyQuestionOption?: SurveyQuestionOptionResolvers<ContextType>;
  SurveyResponse?: SurveyResponseResolvers<ContextType>;
  SurveyResponseAccess?: SurveyResponseAccessResolvers<ContextType>;
  SurveySection?: SurveySectionResolvers<ContextType>;
  SurveyUser?: SurveyUserResolvers<ContextType>;
};

