{
"schemaVersion": "2025-10",
"maintainer": "Marcus",
"lastUpdated": "2025-10-31",
"language": {
"primary": "sv",
"fallback": "en",
"notes": "All user prompts and explanations should be in Swedish, while code, commits and technical terms remain in English."
},
"description": "Central manifest defining all Claude AI agents available in the AI-CLI workspace. Used for automated reasoning, documentation, QA and development workflows.",
"autoLoad": true,
"defaultModel": "sonnet",
"logging": {
"enabled": true,
"method": "node tools/log-session.js"
},
"modelVerification": {
"policy": "Claude shall evaluate model performance based on token efficiency and output quality.",
"method": "Auto-update field 'modelPreference' after each successful agent run.",
"reviewInterval": "monthly"
},
"agents": [
{
"name": "accessibility-auditor",
"displayName": "Accessibility Auditor",
"role": "Analyserar och granskar gränssnitt ur tillgänglighetssynpunkt (WCAG, kontrast, tangentnavigering, ARIA).",
"priority": 10,
"trigger": ["ui", "a11y", "design review"],
"modelPreference": "sonnet",
"color": "blue",
"dependsOn": ["ui-consistency-agent"]
},
{
"name": "build-verifier",
"displayName": "Build Verifier",
"role": "Validerar byggprocess, versioner och beroenden före release.",
"priority": 8,
"trigger": ["build", "deploy"],
"modelPreference": "sonnet",
"color": "green",
"dependsOn": ["documentation-agent", "security-policy-agent"]
},
{
"name": "code-reviewer-agent",
"displayName": "Code Reviewer Agent",
"role": "Genomför teknisk kodgranskning för kvalitet, stil, säkerhet och underhållbarhet.",
"priority": 7,
"trigger": ["commit", "pull request"],
"modelPreference": "sonnet",
"color": "yellow",
"dependsOn": ["test-writer", "security-policy-agent"]
},
{
"name": "code-reviewer",
"displayName": "Code Reviewer (Lite)",
"role": "Snabb, sammanfattande kodgranskning med fokus på logikfel och syntax.",
"priority": 6,
"trigger": ["commit"],
"modelPreference": "haiku",
"color": "yellow",
"dependsOn": ["code-reviewer-agent"]
},
{
"name": "data-integrity-agent",
"displayName": "Data Integrity Agent",
"role": "Säkerställer datakvalitet och konsistens i projektets datamodeller och API-flöden.",
"priority": 5,
"trigger": ["database", "migration", "sync"],
"modelPreference": "haiku",
"color": "green",
"dependsOn": []
},
{
"name": "dependency-auditor",
"displayName": "Dependency Auditor",
"role": "Skannar beroenden för sårbarheter, licensproblem och föråldrade paket.",
"priority": 9,
"trigger": ["audit", "security", "npm install"],
"modelPreference": "sonnet",
"color": "red",
"dependsOn": ["security-policy-agent"]
},
{
"name": "design-system-agent",
"displayName": "Design System Agent",
"role": "Granskar komponentbibliotek och design tokens för visuell och strukturell konsekvens.",
"priority": 11,
"trigger": ["ui", "design", "review"],
"modelPreference": "sonnet",
"color": "purple",
"dependsOn": ["ui-consistency-agent"]
},
{
"name": "documentation-agent",
"displayName": "Documentation Agent",
"role": "Underhåller och uppdaterar all dokumentation – README, CHANGELOG, API och utvecklarguider.",
"priority": 4,
"trigger": ["docs", "release", "onboarding"],
"modelPreference": "haiku",
"color": "green",
"dependsOn": []
},
{
"name": "environment-checker",
"displayName": "Environment Checker",
"role": "Verifierar utvecklingsmiljö, Node-version, Git och Claude CLI-konfiguration.",
"priority": 12,
"trigger": ["setup", "post-install"],
"modelPreference": "haiku",
"color": "cyan",
"dependsOn": []
},
{
"name": "github-monitor-trace-agent",
"displayName": "GitHub Monitor Trace Agent",
"role": "Övervakar commits, PR:ar och issues för spårbarhet och projektstatus.",
"priority": 3,
"trigger": ["github", "traceability", "release review"],
"modelPreference": "sonnet",
"color": "green",
"dependsOn": ["release-notes-agent", "task-prioritizer-agent"]
},
{
"name": "performance-inspector",
"displayName": "Performance Inspector",
"role": "Analyserar prestanda i frontend och backend med DevTools och Lighthouse-data.",
"priority": 6,
"trigger": ["perf", "audit", "release"],
"modelPreference": "sonnet",
"color": "red",
"dependsOn": ["environment-checker"]
},
{
"name": "release-notes-agent",
"displayName": "Release Notes Agent",
"role": "Genererar release-notes och changelogs baserat på commits, issues och PR-historik.",
"priority": 2,
"trigger": ["release", "sprint", "summary"],
"modelPreference": "haiku",
"color": "yellow",
"dependsOn": ["documentation-agent"]
},
{
"name": "security-policy-agent",
"displayName": "Security Policy Agent",
"role": "Analyserar kod och konfigurationer mot OWASP Top 10 och säkerhetsstandarder.",
"priority": 1,
"trigger": ["deploy", "audit", "security"],
"modelPreference": "sonnet",
"color": "red",
"dependsOn": []
},
{
"name": "task-prioritizer-agent",
"displayName": "Task Prioritizer Agent",
"role": "Analyserar backlogg och prioriterar uppgifter efter värde, risk och beroenden.",
"priority": 5,
"trigger": ["planning", "sprint", "triage"],
"modelPreference": "haiku",
"color": "green",
"dependsOn": ["github-monitor-trace-agent"]
},
{
"name": "test-automation-agent",
"displayName": "Test Automation Agent",
"role": "Genererar och kör automatiserade tester (unit, integration, E2E) för kodbasen.",
"priority": 4,
"trigger": ["test", "ci", "pre-release"],
"modelPreference": "sonnet",
"color": "yellow",
"dependsOn": ["test-writer"]
},
{
"name": "test-writer",
"displayName": "Test Writer",
"role": "Skriver enhetliga och robusta testfall baserat på funktioner, buggar eller kodändringar.",
"priority": 4,
"trigger": ["test", "new feature"],
"modelPreference": "sonnet",
"color": "green",
"dependsOn": []
},
{
"name": "ui-consistency-agent",
"displayName": "UI Consistency Agent",
"role": "Granskar HTML, CSS och komponentmarkup för visuell och semantisk konsekvens.",
"priority": 8,
"trigger": ["ui", "design", "a11y"],
"modelPreference": "sonnet",
"color": "yellow",
"dependsOn": []
},
{
"name": "user-feedback-agent",
"displayName": "User Feedback Agent",
"role": "Samlar, analyserar och sammanställer användarfeedback för produktinsikter.",
"priority": 5,
"trigger": ["feedback", "survey", "release"],
"modelPreference": "sonnet",
"color": "blue",
"dependsOn": []
}
]
}
