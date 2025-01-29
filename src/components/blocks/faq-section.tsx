"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is a Battery Emulator?",
    answer: "A Battery Emulator is a sophisticated device that simulates the behavior of various battery types. It allows engineers and researchers to test their devices with different battery characteristics without using actual batteries, saving time and resources while ensuring consistent test conditions."
  },
  {
    question: "Which battery types can be emulated?",
    answer: "Our Battery Emulators support a wide range of battery types including Lithium-ion, LiFePO4, Lead-acid, and NiMH batteries. Each model can be configured to match specific battery characteristics and behaviors."
  },
  {
    question: "What are the main applications?",
    answer: "Battery Emulators are commonly used in R&D labs, production testing, quality control, and educational institutions. They're essential for testing battery-powered devices, battery charging systems, and power management systems."
  },
  {
    question: "How accurate is the battery simulation?",
    answer: "Our Battery Emulators provide highly accurate simulations with response times in microseconds and voltage/current accuracy typically better than 0.1%. The exact specifications vary by model and can be found in each product's technical documentation."
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Yes, we offer customized Battery Emulator solutions to meet specific requirements. Our team can work with you to develop a solution that matches your exact testing needs, including custom voltage ranges, current capabilities, and special features."
  }
]

export function FAQSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-500">
          Find answers to common questions about our Battery Emulators and services.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
} 