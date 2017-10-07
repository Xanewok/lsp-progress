// the file contains the actual implementation of the proposed protocol for the vscode-languageserver node module.

// If you want to 'publish' the protocol extension as a pull request against the repository the above files need to be added to the following directories:

// protocol/${name}.proposed.ts and protocol/${name}.proposed.md files got into the protocol\src folder.
// the client/${name}.proposed.ts file goes into the client\src folder.
// the server/${name}.proposed.ts file goes into the server\src folder.
// Please also ensure that you re-export the proposed API from the client\src\main.ts and the server\src\main.ts. Corresponding stubs can be found at the end of these files.

// Users who want to make use of new proposed protocols needs to create the a client and register the proposed protocol with it in the following way:

// let client = new LanguageClient('...', serverOptions, clientOptions);
// client.registerProposedFeatures();
// For the server a user needs to pass the feature implementation to the createConnection call. An example looks like this:

// import { ..., ProposedFeatures } from 'vscode-languageserver';

// let connection = createConnection(ProposedFeatures.all);
// If you decide to publish the protocol extension in its own repository it must contain that above files with it defined name and format. The repository also needs documentation on how to instanciate the client and server features.