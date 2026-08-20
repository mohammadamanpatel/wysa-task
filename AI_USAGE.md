# AI Usage

I used ChatGPT as a development assistant while working on this take-home assignment.

AI was mainly used for understanding the requirements, discussing the backend design, reviewing implementation ideas, explaining code, and helping with testing scenarios.

I reviewed and tested the suggestions myself before using them in the project.

## 1. AI Tool Used

- ChatGPT

## 2. How I Used AI

I used AI during development for:

- Understanding the conversation flow requirements.
- Discussing the MongoDB data structure.
- Understanding how modules, questions, and options should be connected.
- Designing the conversation history and active state.
- Understanding checkpoint and context version behavior.
- Separating the code into controller, service, and repository layers.
- Reviewing controller and service implementations.
- Explaining errors and unexpected behavior in simple terms.
- Creating Postman request examples for testing.
- Reviewing the expected database state after API requests.

## 3. Main Prompts / Discussions

Some of the main things I asked AI during development were:

- Explain the conversation flow in simple terms.
- How should `conversationHistory` be stored?
- How should `activeState` work?
- How should `moduleStates` be maintained?
- How should a user move from one module to another?
- How should checkpoint questions affect `contextVersion`?
- How should the deep-link controller work?
- How can the controller code be cleaned using a service and repository layer?
- What should be tested in Postman?
- How should the Git repository and documentation be prepared?

## 4. Changes I Made to the AI Suggestions

I did not directly use AI-generated code without reviewing it.

I made changes based on my actual implementation and testing, including:

- Kept the project structure simple with controllers, services, repositories, models, and routes.
- Used UUIDs for module IDs, question IDs, and option IDs.
- Generated question and option IDs on the backend.
- Used MongoDB and Mongoose for storing modules and user conversations.
- Stored complete user answers in `conversationHistory`.
- Used `activeState` to store the user's current module and question.
- Used `moduleStates` to remember the user's progress in individual modules.
- Implemented checkpoint-based `contextVersion` updates.
- Tested the module transitions using actual module and question IDs from MongoDB.
- Adjusted API requests and data when the actual database state differed from the initial test data.

## 5. Issues Found During Development

While developing and testing, some implementation issues were identified and corrected manually.

Examples include:

- Incorrect or outdated question IDs in option transitions.
- Incorrect next module/question mappings during testing.
- Duplicate questions created during early testing.
- Making sure `isCheckPoint` used the correct spelling and capitalization.
- Correcting the active state after moving between modules.
- Verifying that checkpoint answers increment the correct module's `contextVersion`.
- Verifying that conversation history remains available after switching modules.

These issues were identified by testing the APIs with Postman and checking the resulting MongoDB documents.

## 6. How I Verified the Implementation

I verified the implementation manually using Postman and MongoDB.

### Module Flow

I tested:

- Creating modules.
- Adding questions.
- Updating questions.
- Connecting questions using `nextQuestionId`.
- Connecting questions across modules using `nextModuleId`.

### Conversation Flow

I tested:

- Starting a module.
- Answering the current question.
- Moving to the next question.
- Moving from one module to another.
- Returning to a previously visited module.

### Conversation History

After answering questions, I checked MongoDB to verify that each answer was stored with:

- `moduleId`
- `questionId`
- `optionId`
- `contextVersion`
- `answeredAt`

### Active State

I tested the current-state API and verified that it returned the user's current:

- `moduleId`
- `currentQuestionId`

### Checkpoint

I marked a Finance question as a checkpoint and tested the flow.

Before answering the checkpoint:

```text
contextVersion: 1