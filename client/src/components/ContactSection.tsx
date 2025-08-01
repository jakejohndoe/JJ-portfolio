import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useScrollAnimation, sectionVariants, staggerItemVariants } from "@/hooks/useScrollAnimation";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const [ref, isInView] = useScrollAnimation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send message');
      }
      
      setSubmitted(true);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll respond soon.",
      });
      form.reset();
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section 
      ref={ref}
      id="contact" 
      className="py-16 bg-background"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6 glow-primary"
            variants={staggerItemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Let's <span className="text-primary text-glow">work</span> together
          </motion.h2>
          <motion.p 
            className="text-gray-300 mb-10"
            variants={staggerItemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Have a project in mind? I'd love to hear about it. Let's discuss how we can work together to bring your ideas to life.
          </motion.p>
          
          <motion.div 
            className="bg-card p-8 rounded-lg shadow-lg"
            variants={staggerItemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {submitted ? (
              <motion.div 
                className="p-4 bg-green-100 text-green-800 rounded-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Message sent successfully! I'll get back to you soon.
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-gray-400 mb-2">Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="w-full bg-[#0F172A] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-gray-400 mb-2">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="w-full bg-[#0F172A] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-400 mb-2">Subject</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full bg-[#0F172A] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-400 mb-2">Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                            className="w-full bg-[#0F172A] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="enhanced-button w-full bg-primary text-white font-medium rounded-lg py-3 px-6 hover:bg-opacity-90 transition relative"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;