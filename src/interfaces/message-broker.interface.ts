

export interface IMessageBroker {
    publish(queue: string, message: any): Promise<void>
    connect(): Promise<void>
    close(): Promise<void>
    isConnected(): boolean
}