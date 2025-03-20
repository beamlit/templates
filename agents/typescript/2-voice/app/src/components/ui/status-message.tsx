import { getEnvironment } from "@/lib/env";
import { useTranslation } from "react-i18next";
import "./status-message.css";

type Properties = {
    isRecording: boolean;
};

export default function StatusMessage({ isRecording }: Properties) {
    const { t } = useTranslation();
    const environment = getEnvironment();
    const envLabel = environment === "prod" ? "Production" : "Local Development";

    if (!isRecording) {
        return (
            <div>
                <p className="text mb-4 mt-6">{t("status.notRecordingMessage")}</p>
                <p className="text-xs text-gray-500">Environment: {envLabel}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center">
                <div className="relative h-6 w-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-around">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 rounded-full bg-purple-600 opacity-80"
                                style={{
                                    animation: `barHeight${(i % 3) + 1} 1s ease-in-out infinite`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
                <p className="text mb-4 ml-2 mt-6">{t("status.conversationInProgress")}</p>
            </div>
            <p className="text-xs text-gray-500">Environment: {envLabel}</p>
        </div>
    );
}
