export const MB = 1024 * 1024;

export const LIMITS = {
    promptChars: 4000,
    optionValueChars: 150,
    maxOutputs: 8,
    uploadBytes: 50 * MB,
    maxPixels: 24_000_000,
    runRequestBytes: 16 * 1024,
    smallJsonBytes: 2 * 1024,
    boardBytes: 3 * MB,
    activeTasksPerOwner: 8,
    pendingUploadsPerOwner: 100,
    signedUrlPerSeconds: 300,
    uploadGrantSeconds: 2 * 60 * 60,
    leaseSeconds: 120,
    heartbeatSeconds: 30
} as const;

