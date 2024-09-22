# 0004 - Architecture Pattern for Frontend

Besitzer/-in: Methusshan Elankumaran

- Status: accepted
- Workload: 3h
- Decider: Methusshan Elankumaran
- Technical Story: [Issue](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2024-Methusshan25/issues/13) 
- Date 2024-08-01

# Context and Problem Statement

To stucture the frontend better, a architecture design had to be chosen

# Decision Drivers

- Easy implementation in react
- Good documentation

# Considered Options

- MVVM
- MVC

# Decision Outcome

MVVM was chosen, because of it's seperation of business and UI logic and and it's testability

# Pros and Cons of the Options

## MVVM

- Good, because it's seperation of concerns
- Good, because of easy testability
- Good, because of resuablity of componants
- Good, because of it's lose architecture
- Bad, because of overarchtecture for small frontends
- Bad, because of care of lots of codes in the view model

## MVC

- Good, because of low complexity due to seperation of applications into MVC blocks
- Good, because of clean seperation of concerns
- Good, because of best support for test-driven development
- Bad, because of mix of businesslogic and UI
- Bad, because of hard reusability of tests
- Bad, because of higher complexity and inefficency of data