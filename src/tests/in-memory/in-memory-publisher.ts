import { IMessageBroker } from "../../interfaces/message-broker.interface";



export class InMemoryPublisher implements IMessageBroker {
    private messages: {queue: string, message: any}[] = []

   async publish(queue: string, message: any): Promise<void> {
        this.messages.push({queue, message})
    }

    async connect() {

    }

    async close() {

    }

    isConnected() {
        return true;
    }

    getPublishedMessages(queue: string) {
        return this.messages.filter(msg => msg.queue === queue).map(msg => msg.message)
    }

    clearMessages():void {
        this.messages = []
    }
}