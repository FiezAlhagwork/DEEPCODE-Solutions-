import { motion } from "motion/react";
import PricingCard from "./PricingCard";
import { PricingListProps } from "@/types";


const PricingList = ({ PricingPlans }: PricingListProps) => {

    const listVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    return (
        <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-4 lg:gap-6"
            role="list"
        >
            {PricingPlans.map((plan) => (
                <PricingCard
                    key={plan.id}
                    plan={plan}

                />
            ))}
        </motion.ul>
    )
}

export default PricingList