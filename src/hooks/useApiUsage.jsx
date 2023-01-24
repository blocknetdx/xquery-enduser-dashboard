import React, { useEffect, useState } from 'react';
import api from '../apis';
import { calcualteApiUsage } from '../utils/helper';

const useApiUsage = ({
    projectId = null, apiKey = null
}) => {
    const [apiUsage, setApiUsage] = useState(null);

    //need to remove, only for the test purpose
    const testRef = React.useRef(1);

    useEffect(() => {
        let updateUsageInterval = null;
        if (!!projectId && !!apiKey) {
            updateUsageInterval = setInterval(() => {
                getProjectDetail();
            }, 60000);
        }

        return () => {
            if (!!updateUsageInterval) {
                clearInterval(updateUsageInterval);
            }
        }
    }, [])

    async function getProjectDetail() {
        const response = await api.project.getProjectStats({
            projectId : projectId,
            apiKey: apiKey
        })

        const { api_tokens = 'N/A', api_tokens_used = 'N/A' } = response?.data?.result || {};

        const usage = api_tokens !== 'N/A' && api_tokens_used !== 'N/A' ? calcualteApiUsage(api_tokens_used, api_tokens) : null;

        setApiUsage(usage);

        //The below for test purpose due to don't know correct projectid and apikey
        //  To test usage functionality without projectid and apikey remove 
        //  comment of the below and make comment the rest of lines inside this function

        // if (testRef.current >= 90) {
        //     testRef.current = 0;
        // }

        // testRef.current += 10;

        // setApiUsage(testRef.current)
    }

    return [apiUsage];
}

export default useApiUsage;