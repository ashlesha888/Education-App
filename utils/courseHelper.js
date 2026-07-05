export const calculateCourseDuration =
(
    courseContent
) => {
    let totalSeconds = 0;

    courseContent.forEach(
        (section) => {
            section.subSections?.forEach(
                (video) => {
                    totalSeconds +=
                        parseDurationToSeconds(
                            video.timeDuration
                        );
                }
            );
        }
    );

    return totalSeconds;
};