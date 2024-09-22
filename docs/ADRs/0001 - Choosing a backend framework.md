# 0001 - Choosing a Backend Framework

Besitzer/-in: Methusshan Elankumaran

- Status: accepted
- Workload: 1h
- Decider: Methusshan Elankumaran
- Technical Story: [Issue](https://github.com/mi-classroom/mi-master-wt-beiboot-2024/issues/1) 
- Date 2024-04-29

# Context and Problem Statement

To create the backend service a suitable backend framework had to be chosen to.

# Decision Drivers

- Scalability
- Performance
- Documentation
- Easy to learn

# Considered Options

- ExpressJS
- Ktor
- Java Spring Boot

# Decision Outcome

Ktor was chosen as the backend framework. The decision was driven by the knowledge of the user in visual computing and the native support of Kotlin.

# Pros and Cons of the Options

## NodeJs / ExpressJS

- Good, because widely used
- Good, because it’s lightweight
- Good, because of scalability
- Bad, because poor support of OpenCV in JS
- Bad, because of limited build in features
- Bad, because of lack of strong typing

## Ktor

- Good, because of high performance
- Good, because of good scalability
- Good, because of well-maintained documentation
- Bad, because of small ecosystem and few third-party librarys
- Bad, because it’s new and is still evolving

## Java Spring Boot

- Good, because of high performance
- Good, because of easy development
- Good, because of strong community
- Bad, because of lack of control and large deployment files
- Bad, because it’s inflexibale