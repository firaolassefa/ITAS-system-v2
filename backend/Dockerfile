# ── Build stage ──────────────────────────────────────────────────────────────
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies separately from source (speeds up rebuilds)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Run stage ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090

# JVM flags tuned for cloud containers (low memory, fast startup)
ENV JAVA_OPTS="\
  -server \
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=70.0 \
  -XX:InitialRAMPercentage=40.0 \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+OptimizeStringConcat \
  -XX:+UseStringDeduplication \
  -Djava.security.egd=file:/dev/./urandom \
  -Dspring.jmx.enabled=false"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
