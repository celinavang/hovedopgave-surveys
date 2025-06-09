export interface SurveyInstance {
    id: string;
    deadline?: string;
    invitationDate?: string;
    responseDate?: string;
    status?: string;
    surveyAccessId: string;
    surveyAccess?: {
        id: string;
        role: string;
        surveyId: string;
        entityId: string;
        survey?: {
            title?: string;
            createdAt?: string;
            creatorId?: string;
            description?: string;
            id?: string;
        };
    };
}

export const surveyTest: SurveyInstance[] = [{
    id: "1",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-01T00:00:00Z",
    status: "AWAITING",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test of a Survey",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "This is a description of a test survey",
            id: "2",
        }

    }
},
{
    id: "2",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-02T00:00:00Z",
    status: "AWAITING",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 2",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "This is a second test",
            id: "2",
        }

    }
},
{
    id: "3",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-03T00:00:00Z",
    status: "AWAITING",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 3",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "This is a third test",
            id: "2",
        }

    }
},
{
    id: "4",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-01T00:00:00Z",
    status: "COMPLETED",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 4",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "Test 4",
            id: "2",
        }

    }
},
{
    id: "5",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-01T00:00:00Z",
    status: "COMPLETED",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 5",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "Test 5",
            id: "2",
        }

    }
},
{
    id: "6",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-01T00:00:00Z",
    status: "COMPLETED",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 6",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "Test 6",
            id: "2",
        }

    }
},
{
    id: "7",
    deadline: "2023-10-01T00:00:00Z",
    invitationDate: "2023-09-01T00:00:00Z",
    status: "COMPLETED",
    surveyAccessId: "1",
    surveyAccess: {
        id: "1",
        role: "Responder",
        entityId: "4",
        surveyId: "2",
        survey: {
            title: "Test Survey 7",
            createdAt: "2023-09-01T00:00:00Z",
            creatorId: "3",
            description: "Test 7",
            id: "2",
        }

    }
}

];

