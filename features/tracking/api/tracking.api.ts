import { api } from "@/shared/api/client";
import {TrackingQueryPayload} from '../model/type'

export async function sendTrackingUserDatasourceTable(
    payload: TrackingQueryPayload
) {
    const response = await api.post(
        "/api/tracking/tracking/",
        payload
    );

    return response.data;
}