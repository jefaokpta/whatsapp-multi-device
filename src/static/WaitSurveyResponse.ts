

export class WaitSurveyResponse{
    private static waitSurveyMap = new Map<string, Date>()

    static addWaitSurvey(key: string, value: Date){
        WaitSurveyResponse.waitSurveyMap.set(key, value)
    }

    static getWaitSurvey(key: string){
        return WaitSurveyResponse.waitSurveyMap.get(key)
    }

    static getAndDeleteWaitSurvey(key: string){
        return WaitSurveyResponse.waitSurveyMap.delete(key)
    }

    static hasWaitSurvey(key: string){
        return WaitSurveyResponse.waitSurveyMap.has(key)
    }
}
