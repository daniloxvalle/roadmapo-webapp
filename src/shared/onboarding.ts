export const onboardingOptions = {
    overlay: {
        padding: 8,
        borderRadius: 6,
    },
    scrollToStep: {
        enabled: false,
    },
    hideButtons: {
        previous: true,
    },
    labels: {
        finishButton: 'Got it'
    }
}

export const onboardingProductEditSteps = [
    {
        attachTo: { element: '#btn-edit-product' },
        content: {
            title: "Welcome aboard",
            description: "We're thrilled to have you here, let's kickstart and make great things happen! Click the Edit button to edit a product."
        },
        options: { hideButtons: { next: true } }
    },
    {
        attachTo: { element: '#field-product-name' },
        content: { title: "Product Name", description: "Enter your product name." },
    },
    {
        attachTo: { element: '#row-product-description' },
        content: { title: "Description", description: "Enter your product description or ask AI to generate one for you." },
    },
    {
        attachTo: { element: '#row-product-vision' },
        content: { title: "Product Vision", description: "Enter your product vision or ask AI to propose one. Click save when you have finished." },
    }
]

export const onboardingProductSelectSteps = [
    {
        attachTo: { element: '#btn-select-product' },
        content: { title: "Roadmap", description: "Good job! Now click the card to open the roadmap. Remember, you can create more products using the + button on the right." },
    }
]

export const onboardingRoadmapStepsTimeframe = [
    {
        attachTo: { element: '#timeframe-header' },
        content: { title: "Roadmap Columns", description: "Your roadmap is divided into time frame columns. Normally months, quarters or now, next and later. Please click on the column title to edit." },
        options: { hideButtons: { next: true } }
    },
    {
        attachTo: { element: '#btn-switch-archive' },
        content: { title: "Archiving", description: "You can archive a column to hide it in the roadmap, normally after the period is over. Click save when you have finished editing." },
    }
]

export const onboardingRoadmapStepsInitiative = [
    {
        attachTo: { element: '#initiative-card' },
        content: { title: "Initiative", description: "You can move an initiative between columns using drag and drop, try it! After that, click an initiative card to edit it." },
        options: { hideButtons: { next: true } }
    },
    {
        attachTo: { element: '#row-objectives' },
        content: { title: "Objectives", description: "Your business objectives and outcomes associated with this initiative." },
    },
    {
        attachTo: { element: '#row-initiative-name' },
        content: { title: "Initiative Name", description: "Enter a name or ask AI to propose an initiative based on your objectives (log in to use)." },
    },
    {
        attachTo: { element: '#row-initiative-description' },
        content: { title: "Story", description: "Enter an initiative description or ask AI to generate one (log in to use). Click save when you have finished." },
    }
]

export const onboardingRoadmapStepsSolution = [
    {
        attachTo: { element: '#solution-stack' },
        content: { title: "Solutions", description: "A solution represents an epic, feature or output. You can move a solution between initiatives using drag and drop. Please click a solution to edit it." },
        options: {
            hideButtons: { next: true }
        }
    },
    {
        attachTo: { element: '#row-solution-name' },
        content: { title: "Solution Name", description: "Enter a name or ask AI to propose a solution based on your initiative (log in to use)." },
    },
    {
        attachTo: { element: '#row-solution-description' },
        content: { title: "User Story", description: "Enter a user story or ask AI to generate one, try it! Click save when you have finished." },
    },
]

export const onboardingRoadmapStepsPublication = [
    {
        attachTo: { element: '#navbar-publish' },
        content: { title: "Publish", description: "The last step is sharing you roadmap on the publications page" },
    }
]

/*
* Options Reference:
* https://v-onboarding-docs.fatihsolhan.com/props/options 
*/
