package org.calpoly.gehackathon.web;

import org.calpoly.gehackathon.domain.Measurement;
import org.calpoly.gehackathon.domain.Tree;
import org.calpoly.gehackathon.repositories.JpaMeasurementRepository;
import org.calpoly.gehackathon.repositories.JpaTreeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/tree")
public class TreeController {
    private static final Logger logger = LoggerFactory.getLogger(TreeController.class);
    private JpaTreeRepository treeRepository;
    private JpaMeasurementRepository measurementRepository;

    @Autowired
    public TreeController(JpaTreeRepository treeRepository, JpaMeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
        this.treeRepository = treeRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Iterable<Tree> trees() {
        return treeRepository.findAll();
    }


    @PostMapping(value = "/insert")
    public ResponseEntity<String> insertTreeClasses(@RequestBody ArrayList<Tree> trees) {
        treeRepository.save(trees);
        return new ResponseEntity<String>(trees.size() + " trees have created.", HttpStatus.CREATED);
    }

    @PutMapping(value = "/updateScore")
    public ResponseEntity<String> insertTreeClasses(@Param("treeId") Integer treeId,
                                                    @Param("score") Double score) {
        Tree tree = treeRepository.findOne(treeId);
        tree.score = score;
        treeRepository.save(tree);
        return new ResponseEntity<String>("TreeId " + treeId + " have been created.", HttpStatus.ACCEPTED);
    }

    /* returns tree benefit score for one tree */
    @GetMapping(value = "/benefit")
    public List<Measurement> getTreeBenefitScore(@RequestParam(value="pedId") String pedId,
                                                 @RequestParam(value="tffcId") String tffcId,
                                                 @RequestParam(value="envId") String envId) {

        return measurementRepository.getTreeBenefitScore(pedId, tffcId, envId);
    }
}