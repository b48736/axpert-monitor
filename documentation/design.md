# Design

## Design Requirements

1) Continuous monitoring
   - Periodic polling
   - Polling controlled externally
2) On-demand requests
   - CLI interface for testing and debugging
   - Event driven settings changes that don't interfere with periodic monitoring
3) Support parallel inverters

## Approach
Use a promise based request queue.

Call a function to add a request to the queue. The function returns a promise that will resolve when the correct response is ready.

