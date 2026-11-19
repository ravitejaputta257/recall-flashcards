import type { Card } from "../types";

export const SUBJECTS: string[] = [
  "Operating Systems",
  "DBMS",
  "OOPs",
  "Computer Networks",
];

// Starter cards so the demo is useful the first time it opens.
// These are standard computer-science questions, not claims about any project.
export const seedCards: Card[] = [
  {
    id: "seed-1",
    subject: "Operating Systems",
    question: "What is the difference between a process and a thread?",
    answer:
      "A process is a program in execution with its own address space. A thread is a lightweight unit inside a process: it shares the address space but has its own stack and registers.",
    known: false,
  },
  {
    id: "seed-2",
    subject: "Operating Systems",
    question: "What is deadlock, and what are its four necessary conditions?",
    answer:
      "Deadlock is when processes block forever waiting for resources held by each other. The four conditions are mutual exclusion, hold and wait, no preemption, and circular wait.",
    known: false,
  },
  {
    id: "seed-3",
    subject: "DBMS",
    question: "What does ACID stand for?",
    answer:
      "Atomicity, Consistency, Isolation and Durability — the properties that make database transactions reliable.",
    known: false,
  },
  {
    id: "seed-4",
    subject: "DBMS",
    question: "What is the difference between a primary key and a foreign key?",
    answer:
      "A primary key uniquely identifies a row in its own table. A foreign key is a column that references the primary key of another table, creating a relationship between them.",
    known: false,
  },
  {
    id: "seed-5",
    subject: "OOPs",
    question: "Explain encapsulation with one example.",
    answer:
      "Encapsulation means bundling data with the methods that operate on it and restricting direct access. For example, a BankAccount class keeps its balance private and exposes deposit() and withdraw() instead.",
    known: false,
  },
  {
    id: "seed-6",
    subject: "OOPs",
    question: "What is the difference between method overriding and overloading?",
    answer:
      "Overriding is a subclass providing its own version of a parent method with the same signature. Overloading is multiple methods with the same name but different parameter lists.",
    known: false,
  },
  {
    id: "seed-7",
    subject: "Computer Networks",
    question: "What happens in a TCP three-way handshake?",
    answer:
      "The client sends SYN, the server replies with SYN-ACK, and the client sends ACK. After that the connection is established and data can flow.",
    known: false,
  },
  {
    id: "seed-8",
    subject: "Computer Networks",
    question: "What is the difference between TCP and UDP?",
    answer:
      "TCP is connection-oriented and reliable, with ordering and retransmission. UDP is connectionless and faster but does not guarantee delivery or order.",
    known: false,
  },
];
