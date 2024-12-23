---
layout: post
title: Deliver with quality
date: 2023-07-17
category: Tutorials
---
# Deliver with quality

## Preface

Working as a software developer, it is necessary to not only understand algorithms, but also the environment in which you are writing your code. It happens that developers also interact with customers to gather necessary information and translate it into the engineer's native language. I have noticed that often this skill is not developed in young coders and is even forgotten in the rush of trying to learn how to use the X language. I decided to write a small summary of what I have learned from my experience. Likewise, I would like to convince you that starting with a piece of paper is beneficial for the code's production and delivery quality.

### Delivery quality

Before we start, the term “delivery quality” should be defined and clearly state what the expectations usually are.

Delivery quality refers to the level of excellence or satisfaction achieved when products, services, or projects are delivered to customers or stakeholders. Achieving high delivery quality often requires:

- planning,
- effective execution,
- quality control measures,
- and continuous improvement efforts.

It is crucial for building customer loyalty, maintaining a positive brand reputation, and ensuring long-term success in various industries and sectors.

These four keywords define delivery quality and can be easily transformed into multiple aspects depending on the type of work or service. Here, by delivered product, we are going to mean an API, feature, or module. This page is going to incorporate this list into four chapters, in which I am going to explain the methodology to deliver **fast** and **with quality**, based on my own experience.

## Planning

Sitting with a paper and pen, or in the meeting discussing details, instead of actually coding the thing, often sounds like a waste of time for developers. We have been born for executive tasks! Don’t we?

Let’s break the myth of developers, which only writes code and implements feature by writing couple functions and ifs statements. We often need to think beyond that. Here comes the communication skill. Before we even jump into the code writing, we need to really know what is the demand. Who else will know better what issues or questions we need to state, in order to deliver something what actually works, if not developers?

#### 1. **Spend some time discussing the delivery directly with the customer.**

It is not always possible, I understand each company has its own procedures, but try to get as close to the product receiver as it is possible. Reducing non-technical people in your road will eliminate the Chinese Whisper Play. Organize a meeting (not long ~ 30–45 minutes) to align your vision with the requester and make some notes. Notes should help you during preparation of the initial draft of the delivery.

Try to go with the following check list, extend it to your scenario:

- functional requirements
    - use cases,
        - describe in simple sentences, how the product will be used
    - error handling;
        - standards of the error codes,
        - behavior in case of critical errors,
            - abort,
            - gracefully error return,
            - exception handling,
            - errno integration,
    - logging;
        - debug logs,
        - status information,
    - versioning and backward compatibility,
- non-functional requirements
    - environment details in which the product will work;
        - multi-threaded or single-threaded,
        - interaction with ISR,
        - speed and memory limitations,
        - real-time constraints
    - configuration methods
        - config files,
        - config symbols,
        - customization level,
        - compile-time, or run-time configuration methods
- integration details
    - how the product should cooperate with other modules,
    - is there already working pieces of code you can reuse,

#### 2. **Prepare an initial draft of the product.**

Creating header files and a basic implementation allows you to connect all the dots from the previous step. Creating the initial draft is going to generate more questions and uncertainties that need to be clarified. Defining the problem on paper will help you determine if you really understand the customer’s needs.

Prepare a header file — a simple source code file that will show the flow and is presentable to the client for initial API review. In case you are interacting with an unknown field, e.g., a new peripheral, creating a PoC (Proof-of-Concept) should first raise problems that need to be raised and discussed. Divide problems into blocks. Name functional blocks and create functions/methods/classes; check how much information needs to be provided explicitly by the user. In this stage, you will probably need to create the first data structures to organize the information passed through the API. Think about [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) and the [SOLID](https://en.wikipedia.org/wiki/SOLID) approach.

At that time, start writing documentation. Document findings, organize them, elaborate on public function behavior, and pass arguments. Do not forget that an image is worth more than a thousand words. People love to see text transformed into schematics and diagrams. It also gives you the opportunity to summarize your approach. Use-case diagrams, sequence diagrams, entity diagrams, and class diagrams should help during preparation of documentation. Try to keep the document as simple as possible to not overwhelm the customer with unnecessary technical details.

#### 3. **Propose the API and functionality draft to the customer.**

The created documentation and header file must be reviewed by the customer before starting the real implementation. Catching misunderstandings and aligning on changes caused by not-discussed items early in the development stage will reduce headaches and delays.

Try to go with the client through prepared documentation, formalized use- cases, and diagrams. Check if they are understandable and note down the questions that were asked; this will give you valid data points on how to improve the documentation.

At this stage, we should finalize the planning. The developer and client are aligned in their needs. Armed with the customer’s feedback on the initial draft, you should be ready to start implementation. In case there were some major problems or concerns raised during the discussion, do not hesitate to follow up with the next iteration of the approach. The customer usually does not know what they want, and the developer is the person who should get him on track.

You should be finalizing this stage, having:

- most of the functional and nonfunctional requirements,
- use case scenarios,
- signed-off design with the customer,
- defined clear definition of done,

and last but not least - 

- defined ETA (Estimated Time of Arrival) of the feature being complete.

During all three stages, it is beneficial to have contact with one of the QA (Quality Assurance) that is going to prepare test cases and is going to put the quality assurance tag on your delivery. Introducing testers to the design process allows for sharing knowledge and pointing out critical points of the product that must be tested before release.

## Effective execution

Now it is time to get our hands dirty. The implementation stage should start by aligning the feature testing methodology with QA. This will give you more insight into how to arrange the methods and function calls to cover their test cases.

Delivering the API or any other implementation often gives additional room to think about other use cases or customizations that would be worth introducing at this stage. I can tell you right away that it is not worth it. Do not create functions or code customizations that you think would be ***potentially*** helpful in the future. Extending the delivery can put you in the rabbit hole of constant code improvements or, at worst, debugging unnecessary parts of code. Such an approach also forces QA to complicate their testing scenarios, which extends the overall process.

It has been said a dozen times in many books. I can only agree with the statement: do not prematurely optimize your code. Do not try to be smart at the beginning of the implementation. I like to compare the development stage to working with clay. You need to give the solution its initial shape, make sure it is working as you designed it, and then try to optimize and refactor the solution.

If your development cycle has been divided into multiple stages, make sure you do not try to speed things up in the first release stage. Delivery divided into smaller parts often reduces the failure rate and allows for easier integration. This is especially important when the device or product is already in the field, and any crash or failure means returning it to the factory. Rushing with the whole implementation of the alpha version of the software can lead to wasted working hours when the first part deployed in the target has major issues.

## Quality control measures

Talk with the quality assurance crew. Developers have more insight into what is happening in their firmware. It is a good idea to have an open discussion about creating testing scenarios. It is important to test the main functionality, functional requirements, and edge cases. Watch for testing cases that have no real-world use cases; those can be taken into consideration but with a lower priority.

Speaking of testing, it is helpful to prepare a testing strategy. Testing review includes sorting test cases from the most important to the least important. Spending some time deliberating about test priorities allows for the most coverage in the initial days/hours of QA testing.

## Final thoughts

In conclusion, effective planning, execution, and quality control measures are essential for delivering high-quality software. Taking the time to communicate and align with the customer, creating an initial draft of the product, and proposing it for review helps ensure that everyone is on the same page. By documenting findings, using diagrams, and summarizing the approach, you can provide clarity and avoid misunderstandings.

During the execution phase, it is important to focus on the task at hand and avoid adding unnecessary features or customizations. Premature optimization and overcomplicating the code can lead to delays and difficulties in testing. Instead, prioritize delivering a working solution before optimizing and refactoring.

Quality control measures should be in place throughout the development process. Collaborating with the QA team, discussing testing scenarios, and preparing a testing strategy are crucial for identifying and addressing potential issues. Prioritizing test cases based on importance and real-world use cases ensures that the most critical aspects of the software are thoroughly tested.

By following these principles of effective planning, execution, and quality control, software developers can improve delivery quality, build customer loyalty, and achieve long-term success in their projects. Remember that software development is not just about writing code; it's about understanding the customer's needs and delivering a solution that meets their expectations.