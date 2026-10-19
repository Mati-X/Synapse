import { EventEmitter } from 'node:events';
import { WorkflowTelemetryEvent } from '@synapse/core';

class TelemetryBroker {
  private emitter = new EventEmitter();

  constructor() {
    // Zwiększamy limit listenerów dla wielu jednoczesnych klientów SSE
    this.emitter.setMaxListeners(100);
  }

  emit(event: WorkflowTelemetryEvent): void {
    this.emitter.emit(`run:${event.runId}`, event);
  }

  subscribe(runId: string, listener: (event: WorkflowTelemetryEvent) => void): () => void {
    const channel = `run:${runId}`;
    this.emitter.on(channel, listener);
    return () => {
      this.emitter.off(channel, listener);
    };
  }
}

export const telemetryBroker = new TelemetryBroker();
