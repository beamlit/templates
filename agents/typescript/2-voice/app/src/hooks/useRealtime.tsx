import useWebSocket from "react-use-websocket";

import {
    ExtensionMiddleTierToolResponse,
    InputAudioBufferAppendCommand,
    InputAudioBufferClearCommand,
    Message,
    ResponseAudioDelta,
    ResponseAudioTranscriptDelta,
    ResponseDone,
    ResponseInputAudioTranscriptionCompleted,
    SessionUpdateCommand
} from "@/types";

type Parameters = {
    useDirectAoaiApi?: boolean; // If true, the middle tier will be skipped and the AOAI ws API will be called directly
    aoaiEndpointOverride?: string;
    aoaiApiKeyOverride?: string;
    aoaiModelOverride?: string;

    enableInputAudioTranscription?: boolean;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: (event: Event) => void;
    onWebSocketMessage?: (event: MessageEvent<any>) => void;

    onReceivedResponseAudioDelta?: (message: ResponseAudioDelta) => void;
    onReceivedInputAudioBufferSpeechStarted?: (message: Message) => void;
    onReceivedResponseDone?: (message: ResponseDone) => void;
    onReceivedExtensionMiddleTierToolResponse?: (message: ExtensionMiddleTierToolResponse) => void;
    onReceivedResponseAudioTranscriptDelta?: (message: ResponseAudioTranscriptDelta) => void;
    onReceivedInputAudioTranscriptionCompleted?: (message: ResponseInputAudioTranscriptionCompleted) => void;
    onReceivedError?: (message: Message) => void;
};

export default function useRealTime({
    useDirectAoaiApi,
    aoaiEndpointOverride,
    aoaiApiKeyOverride,
    aoaiModelOverride,
    enableInputAudioTranscription,
    onWebSocketOpen,
    onWebSocketClose,
    onWebSocketError,
    onWebSocketMessage,
    onReceivedResponseDone,
    onReceivedResponseAudioDelta,
    onReceivedResponseAudioTranscriptDelta,
    onReceivedInputAudioBufferSpeechStarted,
    onReceivedExtensionMiddleTierToolResponse,
    onReceivedInputAudioTranscriptionCompleted,
    onReceivedError
}: Parameters) {
    const wsEndpoint = "ws://localhost:1338/ws";
    const { sendJsonMessage } = useWebSocket(wsEndpoint, {
        onOpen: () => onWebSocketOpen?.(),
        onClose: () => onWebSocketClose?.(),
        onError: event => onWebSocketError?.(event),
        onMessage: event => onMessageReceived(event),
        shouldReconnect: () => true,
        queryParams: {
            environment: "production",
            token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJlYW1saXQiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiaHR0cHM6Ly9hcGkuYmVhbWxpdC5kZXYiLCJodHRwczovL2FwaS5iZWFtbGl0LmNvbSIsImh0dHBzOi8vcnVuLmJlYW1saXQuZGV2IiwiaHR0cHM6Ly9ydW4uYmVhbWxpdC5jb20iLCJiZWFtbGl0Il0sImVtYWlsIjoiY3Bsb3Vqb3V4QGJlYW1saXQuY29tIiwiZXhwIjoxNzM4NzEzMTczLCJmYW1pbHlfbmFtZSI6IiIsImdpdmVuX25hbWUiOiIiLCJpYXQiOjE3Mzg3MDU5NzMsImlzcyI6Imh0dHBzOi8vYXBpLmJlYW1saXQuZGV2L3YwIiwianRpIjoiUTdDSElTN09RSlhLMzc2TyIsIm5iZiI6MTczODcwNTk3Mywic2NvcGUiOiIqIiwic3ViIjoiZjVhODJiYmEtZDNjNS00MmIzLWI2ODYtNTUwNDU3MWNlODY0Iiwic3ViX3R5cGUiOiJ1c2VyIn0.e8bSopYQAM4IX3SNWeXd_aEB1ZT4MZ1T1oUDn-JPyMiUQKta9VSEJ1tSkMLWdFjG9VTPKKvQhVaZQ3u0djjAC-O8FZZ0D9buBBtY76SRORQXqOx5is_KZiN4UyNKoyycpqjpZbsu3ZGBCMz-2PYidipDQ0KDFGNWHqa-pZHFPnRkyYZ5ZoNw0Ac3IV0_lITCr-GkS-kqLLOVsHUiRPGK7Aj-uB21iz7kitGnCbrKc9djBFRtiuYNsYvE2HPm_K0PXVPTpeZX2smPoTRHvLiJD_2uMBC-UhzG1lzuvRl1F7GXmko240ytBScoap8gnd0ePzh_1HpcCLb2jgPZqy1sJDbvij9ivIONxwvsMTRv9BtgC5VxNbofEMdQuT-ZOf9UKLb7QhCJ4M2CP_LF83_KRSQ_JBsQ4RjMAPsHOW70KA0oaV9yjz-enP940MaqVbpDt5qQuYrKTEUAT_G20FGypjrucFwX4i7KxNoTAiXYyiO61vIlLyF2iLDcEpARr5eF-FANWt7eehqHksofpjB3IreXfchv-iRING0SpcozS1tikfg0q2xo4_SQokyyieOJ_BYbR1cJjNAPkT7bpcNy4ssluarWcNdQ_NxQ8E3Q1vX_hOMSPWb6t0mS0dLQWSFFtPHhF_gEXGf7te_bmQX1MBotsKNvgo-NvBZUVUHwHIY"
        }
    });

    const startSession = () => {
        const command: SessionUpdateCommand = {
            type: "session.update",
            session: {
                turn_detection: {
                    type: "server_vad"
                }
            }
        };

        if (enableInputAudioTranscription) {
            command.session.input_audio_transcription = {
                model: "whisper-1"
            };
        }

        sendJsonMessage(command);
    };

    const addUserAudio = (base64Audio: string) => {
        const command: InputAudioBufferAppendCommand = {
            type: "input_audio_buffer.append",
            audio: base64Audio
        };

        sendJsonMessage(command);
    };

    const inputAudioBufferClear = () => {
        const command: InputAudioBufferClearCommand = {
            type: "input_audio_buffer.clear"
        };

        sendJsonMessage(command);
    };

    const onMessageReceived = (event: MessageEvent<any>) => {
        onWebSocketMessage?.(event);

        let message: Message;
        try {
            message = JSON.parse(event.data);
        } catch (e) {
            console.error("Failed to parse JSON message:", e);
            throw e;
        }

        switch (message.type) {
            case "response.done":
                onReceivedResponseDone?.(message as ResponseDone);
                break;
            case "response.audio.delta":
                onReceivedResponseAudioDelta?.(message as ResponseAudioDelta);
                break;
            case "response.audio_transcript.delta":
                onReceivedResponseAudioTranscriptDelta?.(message as ResponseAudioTranscriptDelta);
                break;
            case "input_audio_buffer.speech_started":
                onReceivedInputAudioBufferSpeechStarted?.(message);
                break;
            case "conversation.item.input_audio_transcription.completed":
                onReceivedInputAudioTranscriptionCompleted?.(message as ResponseInputAudioTranscriptionCompleted);
                break;
            case "extension.middle_tier_tool_response":
                onReceivedExtensionMiddleTierToolResponse?.(message as ExtensionMiddleTierToolResponse);
                break;
            case "error":
                onReceivedError?.(message);
                break;
        }
    };

    return { startSession, addUserAudio, inputAudioBufferClear };
}
