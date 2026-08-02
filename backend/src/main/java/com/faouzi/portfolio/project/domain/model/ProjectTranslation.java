package com.faouzi.portfolio.project.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "project_translation")
public class ProjectTranslation {

    @Id
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 220)
    private String title;

    @Column(length = 800)
    private String summary;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String context;

    @Column(columnDefinition = "text")
    private String problem;

    @Column(columnDefinition = "text")
    private String objectives;

    @Column(name = "target_users", columnDefinition = "text")
    private String targetUsers;

    @Column(columnDefinition = "text")
    private String role;

    @Column(columnDefinition = "text")
    private String responsibilities;

    @Column(columnDefinition = "text")
    private String solution;

    @Column(name = "architecture_notes", columnDefinition = "text")
    private String architectureNotes;

    @Column(columnDefinition = "text")
    private String features;

    @Column(columnDefinition = "text")
    private String challenges;

    @Column(columnDefinition = "text")
    private String decisions;

    @Column(columnDefinition = "text")
    private String results;

    @Column(name = "seo_title", length = 70)
    private String seoTitle;

    @Column(name = "seo_description", length = 160)
    private String seoDescription;

    public ProjectTranslation(UUID id, UUID projectId, String languageCode) {
        this.id = id;
        this.projectId = projectId;
        this.languageCode = languageCode;
    }

    public void update(
            String title,
            String summary,
            String description,
            String context,
            String problem,
            String objectives,
            String targetUsers,
            String role,
            String responsibilities,
            String solution,
            String architectureNotes,
            String features,
            String challenges,
            String decisions,
            String results,
            String seoTitle,
            String seoDescription
    ) {
        this.title = Project.blankToNull(title);
        this.summary = Project.blankToNull(summary);
        this.description = Project.blankToNull(description);
        this.context = Project.blankToNull(context);
        this.problem = Project.blankToNull(problem);
        this.objectives = Project.blankToNull(objectives);
        this.targetUsers = Project.blankToNull(targetUsers);
        this.role = Project.blankToNull(role);
        this.responsibilities = Project.blankToNull(responsibilities);
        this.solution = Project.blankToNull(solution);
        this.architectureNotes = Project.blankToNull(architectureNotes);
        this.features = Project.blankToNull(features);
        this.challenges = Project.blankToNull(challenges);
        this.decisions = Project.blankToNull(decisions);
        this.results = Project.blankToNull(results);
        this.seoTitle = Project.blankToNull(seoTitle);
        this.seoDescription = Project.blankToNull(seoDescription);
    }
}
