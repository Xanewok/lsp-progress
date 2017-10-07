// this file contains the actual implementation of the proposed protocol for the vscode-languageclient. Since version 3.4.0 the client supports implementing protocol in so called features that can be registered with a client. A static feature is responsible for:

// filling in the initalize properties (fillInitializeParams method)
// filling in the client capabilities (fillClientCapabilities method)
// initalizing the feature (initialize method)
// The client also supports adding dynamic features. A dynamic feature supports capability registration requests sent from the server to the clients. See client/registerCapability and client/unregisterCapability in the protocol.