import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"

const teamMembers = [
    {
        name: "Shivam",
        role: "Lead Backend Developer",
        description:
            "Specializes in architecting scalable server-side systems and real-time communication protocols.",
        color: "from-violet-500 to-fuchsia-500",
    },
    {
        name: "Krish",
        role: "Lead Frontend Developer",
        description:
            "Expert in building immersive user interfaces and managing complex client-side state.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        name: "Aryan",
        role: "UI/UX Designer",
        description:
            "Focused on creating beautiful, intuitive, and user-centric designs that define the application's look.",
        color: "from-emerald-500 to-teal-500",
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
}

const Team = () => {
    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
            {/* Header */}
            <header className="px-8 py-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-400 to-slate-600 bg-clip-text text-transparent"
                >
                    Meet the Team
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto"
                >
                    The passionate individuals behind the Workspace Chatting
                    Application.
                </motion.p>
            </header>

            {/* Team Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-20 max-w-6xl mx-auto"
            >
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{
                            y: -10,
                            scale: 1.02,
                            transition: { duration: 0.2 },
                        }}
                        className="relative group"
                    >
                        <div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500`}
                        ></div>
                        <div className="relative flex flex-col items-center p-8 bg-slate-900 border border-white/10 rounded-2xl h-full">
                            {/* Avatar Placeholder */}
                            <div
                                className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-xl`}
                            >
                                {member.name[0]}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                {member.name}
                            </h3>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${member.color} text-white mb-4`}
                            >
                                {member.role}
                            </div>
                            <p className="text-slate-400 text-center text-sm leading-relaxed">
                                {member.description}
                            </p>

                            {/* Decorative element */}
                            <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-4 h-4 rounded-sm border border-slate-500"></div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-4 h-4 rounded-full border border-slate-500"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Navigation Footer */}
            <div className="mt-auto p-8 flex justify-center border-t border-white/5 bg-slate-900/50">
                <NavLink
                    to="/chat"
                    className="px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                >
                    <span>←</span> Back to Chat
                </NavLink>
            </div>
        </div>
    )
}

export default Team
