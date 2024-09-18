import React, { ReactNode } from 'react';
import { Brain, ShieldAlert, Sprout } from 'lucide-react';

export type ResourceSection = { title: string; icon: ReactNode; articles: ResourceArticle[] }
export type ResourceArticle = { link?: string; minutes?: number; content: string; title: string; hideLink?: boolean }


export const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    title: 'Crisis Information',
    icon: <ShieldAlert className="size-6" />,
    articles: [
      {
        title: 'If you think you may hurt yourself or attempt suicide, call 988 in the U.S',
        hideLink: true,
        link: '',
        content: ``
      },
      {
        title: 'You can also call your local emergency number immediately. (Temple Police: 215-204-123)',
        hideLink: true,
        link: '',
        content: ``
      },
      {
        title: 'Learn more about your options',
        link: 'crisis-learn-more',
        minutes: 1,
        content: `
**If you think you may hurt yourself or attempt suicide, call [988](tel:988) in the U.S. or your local emergency number immediately.**

**Temple Police:** [215-204-1234](tel:215-204-1234)

### Also, consider these options if you're having suicidal thoughts:
- Call your doctor or mental health professional.
- Contact a suicide hotline.
  - In the U.S., call or text [988](tel:988) to reach the **988 Suicide & Crisis Lifeline** - available 24 hours a day, seven days a week.
  - Or use the [Lifeline Chat](https://988lifeline.org/chat/). Services are free and confidential.

### U.S. Veterans or service members:
- Call [988](tel:988) and press "1" for the **Veterans Crisis Line**.
- Text [838255](sms:838255).
- Or [chat online](https://www.veteranscrisisline.net/get-help/chat).

### Spanish language support:
- Call the **Suicide & Crisis Lifeline** Spanish phone line at [1-888-628-9454](tel:1-888-628-9454) (toll-free).

### Additional steps:
- Reach out to a close friend or loved one.
- Contact a minister, spiritual leader, or someone else in your faith community.

### If a loved one is in danger of suicide or has made a suicide attempt:
- Ensure someone stays with that person.
- Call [911](tel:911) or your local emergency number immediately.
- If safe to do so, take the person to the nearest hospital emergency room.
`
      }
    ]
  },
  // {
  //   title: 'On Campus Resources',
  //   icon: <GraduationCap className="size-6" />,
  //   articles: [
  //     {
  //       title: '',
  //       content: '',
  //       hideLink: true,
  //       link: ''
  //     }
  //   ]
  // },
  {
    title: 'Mental Health',
    icon: <Brain className="size-6" />,
    articles: [
      {
        link: 'what-is-anxiety',
        title: 'What is Anxiety?',
        minutes: 5,
        content: `
An anxiety disorder is a type of mental health condition. If you have an anxiety disorder, you may respond to certain things and situations with fear and dread. You may also experience physical signs of anxiety, such as a pounding heart and sweating.

It's normal to have some anxiety. You may feel anxious or nervous if you have to:

- Tackle a problem at work
- Go to an interview
- Take a test
- Make an important decision

Anxiety can even be beneficial. For example, anxiety helps us notice dangerous situations and focuses our attention so we stay safe.

## What is an Anxiety Disorder?

An anxiety disorder goes beyond the regular nervousness and slight fear you may feel from time to time. An anxiety disorder happens when:

- **Anxiety interferes with your ability to function.**
- **You often overreact when something triggers your emotions.**
- **You can't control your responses to situations.**

Anxiety disorders can make it difficult to get through the day. Fortunately, there are several effective treatments for anxiety disorders.

## Types of Anxiety Disorders

- **Generalized Anxiety Disorder**
- **Social Anxiety Disorder**
- **Agoraphobia**
- **Panic Disorder**
- **Specific Phobias**
- **Separation Anxiety Disorder**

*Anxiety disorders are the most common mental health conditions in the U.S. They affect about 40 million Americans.*

## Symptoms

Symptoms vary depending on the type of anxiety disorder you have. General symptoms of an anxiety disorder include:

### Physical Symptoms

- Cold or sweaty hands
- Dry mouth
- Heart palpitations
- Nausea
- Numbness or tingling in hands or feet
- Muscle tension
- Shortness of breath

### Mental Symptoms

- Feeling panic, fear, and uneasiness
- Nightmares
- Repeated thoughts or flashbacks of traumatic experiences
- Uncontrollable, obsessive thoughts

### Behavioral Symptoms

- Inability to be still and calm
- Ritualistic behaviors, such as washing hands repeatedly
- Trouble sleeping

## Diagnosis

If you have symptoms of an anxiety disorder, talk to your healthcare provider. They'll start with a complete medical history and physical examination.

There are no lab tests or scans that can diagnose anxiety disorders. But your provider may run some tests to rule out physical conditions that may be causing symptoms.

### Who Can Diagnose Anxiety Disorders?

If your provider finds no signs of physical illness, they may refer you to a psychiatrist or psychologist. These mental health professionals specialize in diagnosing and treating mental illnesses. They may use specially designed interviews and assessment tools to figure out if you have an anxiety disorder. Typically, the provider bases a diagnosis on:

- Your reported symptoms, including how intense they are and how long they last
- Discussion of how the symptoms interfere with your daily life
- The provider's observation of your attitude and behavior

Providers also consult the **Diagnostic and Statistical Manual of Mental Disorders (DSM-5)**. The American Psychiatric Association publishes the DSM-5. It's the standard reference manual for diagnosing mental illnesses.

## Treatment

An anxiety disorder is like any other health problem that requires treatment. You can't will it away. It's not a matter of self-discipline or attitude. Researchers have made a lot of progress in the last few decades in treating mental health conditions. Your healthcare provider will tailor a treatment plan that works for you. Your plan may combine medication and psychotherapy.

### How Does Medication Treat Anxiety Disorders?

Medications can't cure an anxiety disorder, but they can improve symptoms and help you function better. Medications for anxiety disorders often include:

- **Anti-anxiety medications**: Such as benzodiazepines, may decrease your anxiety, panic, and worry. They work quickly, but you can build up a tolerance to them, making them less effective over time. Your healthcare provider may prescribe an anti-anxiety medication for the short term, then taper you off or add an antidepressant to the mix.
- **Antidepressants**: Can also help with anxiety disorders. They tweak how your brain uses certain chemicals to improve mood and reduce stress. Antidepressants may take some time to work, so be patient. If you feel like you're ready to stop taking antidepressants, talk to your provider first.
- **Beta-blockers**: Usually used for high blood pressure, can help reduce some of the physical symptoms of anxiety disorders. They can relieve rapid heartbeat, shaking, and trembling.

Your healthcare provider will work with you to find the right medication combination and dosage. Don't change the dose without consulting your provider. They'll monitor you to make sure the medicines are working without causing negative side effects.

### How Does Psychotherapy Treat Anxiety Disorders?

Psychotherapy, or counseling, helps you deal with your emotional response to the illness. A mental health provider talks through strategies to help you better understand and manage the disorder. Approaches include:

- **Cognitive Behavioral Therapy (CBT)**: The most common type of psychotherapy used with anxiety disorders. CBT for anxiety teaches you to recognize thought patterns and behaviors that lead to troublesome feelings. You then work on changing them.
- **Exposure Therapy**: Focuses on dealing with the fears behind the anxiety disorder. It helps you engage with activities or situations you may have been avoiding. Your provider may also use relaxation exercises and imagery with exposure therapy.

### What Happens If I Don't Get Treatment for My Anxiety Disorder?

Getting help for an anxiety disorder can improve self-esteem and daily functioning. But untreated anxiety disorders can harm:

- Family relationships
- School performance
- Sport performance
- Social functioning

You may also end up with more serious mental and physical health problems. Fortunately, there are several treatments for anxiety disorders. The right treatment can help you manage your symptoms and feel your best!
`
      },
      {
        link: 'adjustment',
        title: 'What is Adjustment?',
        minutes: 6,
        content: `Adjustment disorders are stress-related conditions. You experience more stress than would normally be expected in response to a stressful or unexpected event, and the stress causes significant problems in your relationships, at work, or at school.

## Causes and Symptoms

### Causes

Adjustment disorder is caused by one or more life stressors. In adults, these stressors are most commonly related to marital discord, finances, or problems at work. In adolescents, common stressors include academic or social challenges, family discord or parents' marital problems, or issues around sexuality.

Examples of other types of stressors include:

  - The death of a loved one
- Life changes
- Unexpected catastrophes or natural disasters
- Medical conditions (such as cancer) and their subsequent treatments

Factors that influence how well a person reacts to stress may include economic conditions, as well as the availability of social support and occupational and recreational opportunities. Social skills, intelligence, genetics, and mastery of existing coping strategies are factors leading an individual to be more or less susceptible to stressors.

### Symptoms

Adjustment disorders affect how you feel and think about yourself and the world and may also affect your actions or behavior. Symptoms include:

  - Feeling sad, hopeless, or not enjoying things you used to enjoy
- Frequent crying
- Worrying or feeling anxious, nervous, jittery, or stressed out
- Trouble sleeping
- Lack of appetite
- Difficulty concentrating
- Feeling overwhelmed
- Difficulty functioning in daily activities
- Withdrawing from social supports
- Avoiding important things such as going to work or paying bills
- Suicidal thoughts or behavior

Symptoms of an adjustment disorder start within three months of a stressful event and last no longer than six months after the end of the stressful event. However, persistent or chronic adjustment disorders can continue for more than six months, especially if the stressor is ongoing, such as sport performance or sport injury.

## Risk Factors

Some circumstances may make you more likely to have an adjustment disorder:

  Stressful life events—both positive and negative—may put you at risk of developing an adjustment disorder. For example:

  - Divorce or marital problems between your parents
- Relationship or interpersonal problems
- Changes in situation such as having a baby, joining a new team, or going away to school
- Adverse situations like losing a job, loss of a loved one, or having financial issues
- Problems in school or at work
- Life-threatening experiences, such as physical assault, combat, or natural disaster
- Ongoing stressors, such as having a medical illness, living in a crime-ridden neighborhood, or constant competition/championships that require high-level, consistent performances

Your own life experiences can also impact how you cope with stress. For example, your risk of developing an adjustment disorder may be increased if you:

- Experienced significant stress in childhood
- Have other mental health problems
- Have a number of difficult life circumstances happening at the same time

Cultural factors can also play a role in how one adjusts to situations. Every culture is different and has a different way of dealing with life's obstacles. It is important to consider if what you've been taught is helpful or hurtful during your adjustment process.

## Coping Strategies

### Avoid Unnecessary Stress

If you are aware of a big change coming up in your life, try not to take on additional responsibilities that will make you even more stressed. Focus on what is important and put any non-essential work on the back burner.

### Healthy Habits

This doesn’t mean finding healthy habits for just your body, but also your mind. Journaling, exercising, forcing yourself to think positive thoughts—these all can help put your mind at ease. Try yoga for calm meditation or running if that helps you get your thoughts in order. Find a way that works for you to express yourself and your feelings.

### Social Support

Support from family and friends is crucial during times of high stress and change. After you are done eliminating the non-essential work, start reaching out to others to see what they might be able to help with—even if it's just a listening ear to vent your anxieties and frustrations to.

### Reach Beyond Your Circle

Depending upon the change, you might consider finding a support group. Finding others who have been through the same or similar challenges will help to inspire you versus feeling alone and helpless in your struggle. It's an opportunity for you to find people who have experienced the same things and make new friends.

## Above All

Seeking professional help is the best solution. Professionals have a variety of techniques and treatments to teach you how to cope with an adjustment disorder. It could be medication, such as antidepressants or antianxiety medications, or a recommendation for talk therapy. Even if it is short term, talk with a therapist to figure out a treatment plan that is right for you and your needs. In therapy, you will learn your triggers and identify your symptoms.

  With proper treatment and care, adjustment disorders are typically resolved within six months. Time and patience are key to successful recovery. Understand that it is okay to feel what you are feeling and know that there are many options to help you. Changes can be tough, but tackling them does not have to be a challenge you face by yourself.
  `
      },
      {
        link: 'seasonal-affective-disorder',
        title: 'What is Seasonal Affective Disorder?',
        minutes: 5,
        content: `
Seasonal Affective Disorder (SAD) is a type of depression that's related to changes in seasons. **SAD** begins and ends at about the same times every year. Most commonly, symptoms start in the fall and continue into the winter months, sapping your energy and making you feel moody. These symptoms often resolve during the spring and summer months. Less often, **SAD** causes depression in the spring or early summer and resolves during the fall or winter months.

## Symptoms

- Feeling fatigued, sad, or down most of the day, nearly every day
- Losing interest in activities you once enjoyed
- Having low energy and feeling sluggish
- Problems with sleeping too much
- Experiencing carbohydrate cravings, overeating, and weight gain
- Difficulty concentrating
- Feeling hopeless, worthless, or guilty
- Thoughts of not wanting to live

### Fall and Winter SAD

The following symptoms are more specific to those who experience **SAD** in the fall and winter months:

- Oversleeping
- Appetite changes, especially craving foods high in carbohydrates
- Weight gain
- Tiredness or low energy

### Spring and Summer SAD

These symptoms are more specific to summer-onset **SAD**:

- Trouble sleeping (insomnia)
- Poor appetite
- Weight loss
- Agitation or anxiety
- Increased irritability

## Common Causes

The specific cause of Seasonal Affective Disorder remains unknown. Some factors that may come into play include:

- **Your biological clock (circadian rhythm):** The reduced level of sunlight in fall and winter may cause winter-onset **SAD**. This decrease in sunlight may disrupt your body's internal clock and lead to feelings of depression.
- **Serotonin levels:** A drop in serotonin, a brain chemical (neurotransmitter) that affects mood, might play a role in **SAD**. Reduced sunlight can cause a drop in serotonin that may trigger depression.
- **Melatonin levels:** The change in season can disrupt the balance of the body's level of melatonin, which plays a role in sleep patterns and mood.

## Risk Factors

Seasonal Affective Disorder is more common in females than males and is also more common in younger adults than older adults. Factors that increase your risk of **SAD** include:

- **Family history:** People with **SAD** may be more likely to have blood relatives with **SAD** or another form of depression.
- **Having major depression or bipolar disorder:** Symptoms of depression may worsen seasonally if you have one of these conditions.
- **Living far from the equator:** **SAD** appears to be more common among people who live far north or south of the equator due to decreased sunlight during the winter and longer days during the summer months.
- **Low level of vitamin D:** Less sunlight and not getting enough vitamin D from foods and other sources may result in low levels of vitamin D in the body.

## Diagnosis

The diagnostic criteria for Seasonal Affective Disorder (SAD) are outlined in the **Diagnostic and Statistical Manual of Mental Disorders (DSM-5)**. To meet the criteria for **SAD**, an individual must experience the following:

- Recurrent episodes of Major Depressive Disorder (MDD) that coincide with a specific time of the year (usually fall and winter).
- The episodes occur in a seasonal pattern for at least two consecutive years.
- The depressive episodes are not better explained by other factors, such as a different medical condition or medication side effects.
- The seasonal episodes of depression significantly outnumber non-seasonal episodes throughout the individual's lifetime.

It's important to note that the diagnosis of **SAD** should be made by a qualified healthcare professional based on a comprehensive assessment of the individual's symptoms, history, and clinical presentation.

## Treatment

Treatment for Seasonal Affective Disorder may include light therapy, psychotherapy, and medications. If you have bipolar disorder, consult with your healthcare provider or mental health professional before engaging in any treatment.

### Light Therapy

In light therapy, also called phototherapy, you sit a few feet from a special light box so that you're exposed to bright light within the first hour of waking up each day. Light therapy mimics natural outdoor light and appears to cause a change in brain chemicals linked to mood.

Light therapy is one of the first-line treatments for fall-onset **SAD**. It generally starts working in a few days to a few weeks and causes very few side effects. Research on light therapy is limited, but it appears to be effective for most people in relieving **SAD** symptoms.

Talk to your healthcare provider or mental health provider before purchasing a light box to find the best one for you and to learn how to use it safely and effectively.

### Psychotherapy

Psychotherapy, also called talk therapy, is another option to treat **SAD**. A type of psychotherapy known as cognitive behavioral therapy can help you:

- Learn healthy ways to cope with **SAD**, especially by reducing avoidance behavior and scheduling meaningful activities
- Identify and change negative thoughts and behaviors that may be making you feel worse
- Learn how to manage stress
- Build healthy behaviors, such as increasing physical activity and improving your sleep patterns

### Medications

Some people with **SAD** benefit from antidepressant treatment, especially if symptoms are severe.

An extended-release version of the antidepressant bupropion (Wellbutrin XL, Aplenzin) may help prevent depressive episodes in people with a history of **SAD**. Other antidepressants also may commonly be used to treat **SAD**.

Your healthcare provider may recommend starting treatment with an antidepressant before your symptoms typically begin each year. They may also recommend that you continue to take the antidepressant beyond the time your symptoms normally go away.

Keep in mind that it may take several weeks to notice full benefits from an antidepressant. In addition, you may have to try different medications before you find one that works well for you and has the fewest side effects.

[Watch this video to learn more about SAD](https://www.youtube.com/watch?v=3A8Rhr2yT58)

## Coping Skills

Remember that everyone is different, and different coping skills may work for different people. However, here are some common ones that usually help with managing symptoms of Seasonal Affective Disorder:

- **Make your environment sunnier and brighter:** Open blinds, trim tree branches that block sunlight, or add skylights to your home. Sit closer to bright windows while at home or in the office.
- **Get outside:** Take a long walk, eat lunch at a nearby park, or simply sit on a bench and soak up the sun. Even on cold or cloudy days, outdoor light can help—especially if you spend some time outside within two hours of getting up in the morning.
- **Exercise regularly:** Exercise and other types of physical activity help relieve stress and anxiety, both of which can increase **SAD** symptoms. Being more fit can make you feel better about yourself, too, which can lift your mood.
- **Normalize sleep patterns:** Schedule reliable times to wake up and go to bed each day. Especially for fall-winter-onset **SAD**, reduce or eliminate napping and oversleeping.
- **Maintain a balanced diet:** Ensure you consume nutrient-rich foods. Avoid excessive consumption of sugary and processed foods.
- **Stay connected with social support:** Stay connected with friends, family, and support networks. Engage in social activities that you enjoy, even if your motivation is low. Seek support and talk openly about your feelings with loved ones or consider joining a support group.
- **Manage your stress:** Practice stress-reducing techniques such as deep breathing exercises, meditation, yoga, or mindfulness. Engaging in activities that bring joy and relaxation, such as hobbies or creative outlets, can also help alleviate stress.
- **Engage in self-care:** Prioritize self-care activities that promote well-being and relaxation. This may include taking warm baths, practicing good hygiene, engaging in pleasurable activities, and setting aside time for self-reflection or self-care rituals.
- **Take a trip:** If possible, take a trip to a warm and sunny place in the colder months if you have winter-onset **SAD**, and vice versa.

**It is important to remember that coping skills alone are often not enough. They are meant to be supplemental to treatment options discussed with a professional.**
`
      },
      {
        link: 'depression',
        title: 'What is Depression',
        minutes: 10,
        content: `
[![Understanding Depression Video](https://img.youtube.com/vi/d7NPnvKFs2Y/0.jpg)](https://youtu.be/d7NPnvKFs2Y)

Clinical depression is one of the most common mental illnesses, affecting more than 19 million Americans each year. This includes:

- **Major depressive disorder**
- **Manic depression**
- **Dysthymia**: A milder, longer-lasting form of depression

Depression is more than just feeling sad or going through a rough patch. It’s a serious mental health condition that requires understanding and medical care. Left untreated, depression can be devastating for those who have it and their families. Fortunately, with early detection, diagnosis, and a treatment plan consisting of medication, psychotherapy, and healthy lifestyle choices, many people can and do get better.

## Causes of Clinical Depression

Some causes may be rooted in a person's biology, such as imbalances in brain chemicals that affect mood. Other potential causes include:

- Early childhood trauma
- Major life stressors
- Medical conditions

## Symptoms of Depression

- Persistent sad, anxious, or "empty" mood
- Sleeping too much or too little; middle of the night or early morning waking
- Reduced appetite and weight loss, or increased appetite and weight gain
- Loss of pleasure and interest in activities once enjoyed, including sex
- Restlessness, irritability
- Persistent physical symptoms that do not respond to treatment (such as chronic pain or digestive disorders)
- Difficulty concentrating, remembering, or making decisions
- Fatigue or loss of energy
- Feeling guilty, hopeless, or worthless
- Thoughts of suicide or death

## Treatment for Depression

Clinical depression is very treatable, with more than 80% of those who seek treatment showing improvement.

### Common Treatments for Depression

There are several common treatments for depression, including:

- **Psychotherapy**: Also known as talk therapy, it involves working with a mental health professional to identify and address the underlying causes of depression. Types include Cognitive Behavioral Therapy (CBT), Interpersonal Therapy (IPT), and Psychodynamic Therapy.
- **Medication**: Antidepressant medications can be effective in treating depression. Types include Selective Serotonin Reuptake Inhibitors (SSRIs), Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs), and Tricyclic Antidepressants (TCAs).
- **Light Therapy**: Involves exposure to bright light, typically for 30 minutes to an hour each day. It's often used to treat Seasonal Affective Disorder (SAD), a type of depression that occurs during the winter months.

It's important to note that treatment for depression is often individualized, and what works for one person may not work for another. Working with a mental health professional to develop a treatment plan tailored to your specific needs is essential.

### Additional Treatment Information

The most commonly used treatments are psychotherapy and antidepressant medication or a combination of the two. The choice of treatment depends on the pattern, severity, and persistence of depressive symptoms, as well as the history of the illness. Early treatment is more effective and helps prevent the likelihood of serious recurrences. Depression must be treated by a physician or qualified mental health professional.

## Preventive Strategies

There are several preventive strategies that can help reduce the risk of developing depressive symptoms:

- **Maintain a healthy lifestyle**: Eat a healthy diet, get regular exercise, and ensure you get enough sleep.
- **Manage stress**: Learn stress management techniques, such as meditation and deep breathing.
- **Build social support**: Having a strong support system can provide a source of emotional support.
- **Practice self-care**: Engage in activities that promote self-care, such as taking a relaxing bath, reading a book, or spending time in nature.
- **Stay connected**: Consider joining a club or organization that aligns with your interests.
- **Seek help early**: If you are experiencing symptoms of depression, seek help early. Early intervention can help prevent symptoms from worsening.

## Coping with Depression

Managing depressive symptoms can be challenging, but there are several coping strategies you can implement into your daily routine:

- **Practice self-care**: Engage in activities that promote self-care, such as exercise, spending time with loved ones, getting enough sleep, and eating a healthy diet.
- **Challenge negative thoughts**: Try to challenge negative thoughts by replacing them with more positive and realistic ones.
- **Set small goals**: Setting small, achievable goals can help you feel a sense of accomplishment and boost your mood.
- **Practice mindfulness**: Mindfulness practices, such as meditation and deep breathing, can help you manage stress and reduce depressive symptoms.
- **Connect with others**: Social support is important. Connect with friends and family members, or consider joining a support group.
- **Seek professional help**: A mental health professional can help you develop a treatment plan tailored to your specific needs.

It's important to note that coping strategies may not work for everyone, and it's okay to seek additional help if needed.

---

For more information:

- [Depression - Mental Health America of Eastern Missouri](https://www.mha-em.org)
- [Depression | NAMI: National Alliance on Mental Illness](https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression)
`
      }
    ]
  }, {
    title: 'Wellness',
    icon: <Sprout className="size-6" />,
    articles: [
      {
        link: 'stress-management',
        title: 'What is Stress Management',
        minutes: 4,
        content: `## Good Stress vs. Troublesome Stress

### Good Stress

Not all stress is bad. In fact, performance and wellness are enhanced with moderate and manageable levels of stress. Stress can create motivation. Without some stress, people wouldn't get a lot done. Positive stress is that extra burst of hormones that helps you finish your final paper, win at sports, and meet everyday challenges.

### Troublesome Stress

Stress can turn troublesome if you are continually in an aroused state and can't return to a relaxed state. This happens when you avoid what is causing you stress, anticipate a stressor in the future, or replay something stressful that happened over and over again in your head. This constant stress can be known as chronic stress and can take a toll on your health and wellness, often leading to mental and physical exhaustion and illness.

## The Inverted-U Hypothesis

![The Inverted-U Hypothesis](migration-TheInvertedUTheoryIMGB1.webp)

## Common Causes of Stress

- Relationships (family, friends, partner)
- Loss and grief—of any kind
- Academic pressure
- Dissatisfaction with field of study
- Roommates and living arrangements
- Transitions to college or home
- New environments
- Time management
- Balancing social life with academic life
- Unrealistic expectations, including perfection
- Physical health, acute and chronic health conditions
- Gender identity and sexual orientation
- Communication
- Social media comparisons

## Symptoms of Stress

- Lack of concentration
- Memory problems
- Trouble thinking clearly
- Inability to problem-solve
- Depression and sadness
- Irritability, frustration, annoyance, anger
- Nervousness, worry, fear
- Feeling out of control
- Racing heart
- Rapid breathing
- Upset stomach, constipation, or diarrhea
- Stomach "butterflies"
- Weight gain or loss
- Back, shoulder, or neck pain
- Tension or migraine headaches
- Skin problems (e.g., acne, hives)
- Hair loss
- Sweaty palms or hands
- Fatigue or trouble sleeping
- Substance abuse

Avoiding your stress will make these symptoms intensify and become more challenging. If you turn towards your stress and find ways to cope, you will find these symptoms will lessen in intensity or go away.

## Coping with Stress

The way you view stress has an impact on your well-being and ability to cope and learn from stress. Learning new coping skills and habits will help you get better at managing stress and build **resilience**—the ability to survive, thrive, and bounce back from challenges.

### Sleep, Food, and Body Movement

Sleeping, eating, and body movement patterns may shift under stress. To help your body rebalance and find energy, try to get a good night’s sleep of 8+ hours per night and eat well.

Moving your body will release good stress hormones that can help you feel better.

### Nature

More and more evidence shows that spending time in nature is good for our health and overall well-being. By going for a walk outside, you are engaging with nature and moving your body!

### Mindfulness and Meditation

Mindfulness is the ability to know what is happening in your body and your mind so that you can gently turn towards what you are experiencing and possibly find relief. One way to be mindful is through meditation. Use your Headspace app as a guide.
`
      },
      {
        link: 'energy-management',
        title: 'What is Energy Management',
        minutes: 3,
        content: `Energy management is about matching your energy to the task in order to excel. Every one of our thoughts and behaviors has an energy consequence. Energy management is crucial for college student-athletes to maintain a balance between their academic commitments and athletic performance.

Energy is a renewable resource, but only up to a certain point. We should balance energy expenditure with renewal.

We have to take into account the need to replenish energy.

## How to Manage Your Energy

[Proper Nutrition](https://temple.slite.page/app/docs/_ckvGqcQbcwa2t): Proper nutrition is essential for optimal energy levels. As a student-athlete, you should focus on consuming a well-balanced diet that includes carbohydrates, proteins, healthy fats, vitamins, and minerals. Ensure you have regular meals and snacks throughout the day to maintain consistent energy levels. Make sure to hydrate adequately to support your physical performance.

**Meal Planning:** Planning your meals in advance can help you stay organized and ensure you have access to healthy food options. Create a meal plan that incorporates nutrient-dense foods, and consider meal prepping to save time during busy periods. This way, you can avoid relying on unhealthy fast food or skipping meals due to time constraints.

[Adequate Rest](https://temple.slite.page/app/docs/75lZklbCcNMOZh): Adequate rest is crucial for both academic and athletic performance. Aim for 7-9 hours of quality sleep each night to promote recovery, concentration, and overall well-being. Develop a consistent sleep schedule and create a conducive environment for sleep, such as keeping your bedroom dark, quiet, and at a comfortable temperature.

**Time Management:** Balancing academics and athletics requires effective time management. Plan your schedule in advance, including study time, practice sessions, competitions, and personal commitments. Prioritize your tasks, set realistic goals, and allocate time for relaxation and social activities. Use tools like calendars, planners, or digital apps to help you stay organized and meet deadlines.

**Give yourself some wiggle room when scheduling your day.**

[Stress Management](https://temple.slite.page/app/docs/jzRYu2fZD5VNic): College student-athletes often face high levels of stress due to the demands of their dual roles. Implement stress management techniques such as deep breathing exercises, mindfulness, meditation, or engaging in hobbies and activities that help you relax. Seek support from teammates, coaches, or university resources when needed.

**Communication and Support:** Maintain open lines of communication with your coaches, professors, and academic advisors. Let them know about your commitments and schedule to ensure they can support you appropriately. Seek help when needed, whether it's academic assistance, additional practice guidance, or personal support.

**Periodization:** Periodization is the strategic planning of training and competition phases to optimize performance and prevent burnout. Work closely with your coaches to develop a training plan that incorporates periods of high-intensity training, rest and recovery, and competition. This structured approach helps balance workload and allows for optimal performance during key events.

Remember, energy management is an ongoing process that requires self-awareness, discipline, and flexibility. It's essential to listen to your body, adapt your strategies when necessary, and prioritize your physical and mental well-being alongside your academic and athletic goals.

## Self-Care

Daily demands of student-athletes can be draining:

- Practice
- Strength and conditioning
- Classes
- Meetings
- Homework
- Tutoring
- Study hall
- Social life
- Making time to connect with family

This is just a few of the things that can drain student-athletes on a typical day.

Aside from the tips previously mentioned, the key factor in managing energy is self-care.

Here are some examples of self-care activities:

- **Mindfulness and Meditation:** Practice relaxation techniques like deep breathing exercises, meditation, or progressive muscle relaxation to reduce stress and promote mental well-being.

- **Mental Health Check-Ins:** Regularly assess and address your mental health. Seek support from counselors, therapists, or student support services if needed. Practice self-reflection and engage in activities that promote positive mental health.

- **Creative Outlets:** Explore creative outlets such as painting, writing, playing a musical instrument, or any other hobby that helps you relax and express yourself outside of sports.

- **Reading and Journaling:** Engage in reading for pleasure or write in a journal to reflect on your thoughts and experiences.

- **Connect with Nature:** Spending some time outside is a great way to ground yourself and change your perspective. Going for a walk or sitting outside in a place you enjoy are great ways to do so.

- **Listen to Music:** Music can help you to feel different emotions based on the genre of music, from slow and relaxing to upbeat and energizing.

- **Stretching:** Incorporate yoga and stretching exercises to improve flexibility, prevent injuries, and promote relaxation. It is also helpful with recovery.

- **Hobbies and Interests:** Make time for hobbies and activities you enjoy outside of sports and academics to help you relax and recharge.

- **Time Alone:** Allow yourself some alone time to reflect, recharge, and focus on your personal growth.

Remember, self-care is personal, and it's important to find activities that resonate with you. Experiment with different techniques and strategies to discover what works best for your physical, mental, and emotional well-being as a student-athlete.`
      }
    ]
  }

];

export const ARTICLES_BY_SLUG = RESOURCE_SECTIONS.flatMap(section => section.articles).reduce((resourceMap, article) => ({
  ...resourceMap,
  [article.link ?? 'unlisted']: article
}), {} as Record<string, ResourceArticle>);
